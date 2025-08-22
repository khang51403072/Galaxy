import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import type BottomSheetType from "@gorhom/bottom-sheet";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import XInput from "@/shared/components/XInput";
import XText from "@/shared/components/XText";
import XIcon from "@/shared/components/XIcon";
import { useCreateAppointmentStore, createAppointmentSelectors } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { useTheme, Theme } from "@/shared/theme/ThemeProvider";
import { MenuItemEntity } from "../types/MenuItemResponse";
import { CategoryEntity } from "../types/CategoriesResponse";
import XNoDataView from "@/shared/components/XNoDataView";
import { useDebounce } from "@/shared/hooks/useDebounce"; // Import từ file riêng

// --- Tách thành các component con để tối ưu render ---

interface CategoryItemProps {
  category: CategoryEntity;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const CategoryItem = React.memo(({ category, isExpanded, onToggle }: CategoryItemProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const handlePress = useCallback(() => onToggle(category.id), [onToggle, category.id]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.categoryHeader}
      accessibilityLabel={`Toggle category ${category.name}, currently ${isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <XText variant="bodyRegular">{category.name}</XText>
      <XIcon 
        name={isExpanded ? "caretUp" : "caretDown"} 
        width={22} 
        height={22} 
        color={theme.colors.text} 
      />
    </TouchableOpacity>
  );
});

interface ServiceItemProps {
  service: MenuItemEntity;
  onSelect: (item: MenuItemEntity) => void;
}

const ServiceItem = React.memo(({ service, onSelect }: ServiceItemProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const handlePress = useCallback(() => onSelect(service), [onSelect, service]);

  return (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={handlePress}
      accessibilityLabel={`Select service ${service.name}, price $${service.regularPrice.toFixed(2)}`}
    >
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <XText 
            numberOfLines={2} 
            variant="bodyRegular" 
            style={styles.serviceName}
          >
            {service.name}
          </XText>
          <XText 
            numberOfLines={2} 
            variant="captionLight" 
            style={styles.serviceDuration}
          >
            {service.duration} mins
          </XText>
        </View>
        <XText variant="bodyLight" style={styles.servicePrice}>
          ${service.regularPrice.toFixed(2)}
        </XText>
      </View>
    </TouchableOpacity>
  );
});


// --- Component chính ---

interface SelectServiceScreenProps {
  visible?: boolean;
  onClose?: () => void;
  onSelect?: (item: MenuItemEntity) => void;
}

interface FlatListItem {
  type: 'category' | 'service';
  id: string;
  data: CategoryEntity | MenuItemEntity;
}

function SelectServiceScreen({ 
  visible = true, 
  onClose = () => {}, 
  onSelect = () => {} 
}: SelectServiceScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const sheetRef = useRef<BottomSheetType>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [searchText, setSearchText] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const { listCategories, listItemMenu } = useCreateAppointmentStore(
    useShallow((state) => ({
      listCategories: createAppointmentSelectors.listCategories(state),
      listItemMenu: createAppointmentSelectors.listItemMenu(state),
    }))
  );

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const debouncedSearch = useDebounce(searchText, 250);

  const filteredServices = useMemo(() => {
    if (!debouncedSearch.trim()) return listItemMenu;
    return listItemMenu.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, listItemMenu]);

  const flatListData = useMemo((): FlatListItem[] => {
    const safeCategories = Array.isArray(listCategories) ? listCategories : [];
    return safeCategories.flatMap((category) => {
      const categoryServices = filteredServices.filter(
        (service) => service.categoryId === category.id
      );
      if (categoryServices.length === 0) return [];

      const items: FlatListItem[] = [{
        type: 'category',
        id: `category-${category.id}`,
        data: category,
      }];

      if (expandedCategories[category.id]) {
        items.push(...categoryServices.map((service): FlatListItem => ({
          type: 'service',
          id: `service-${service.id}`,
          data: service,
        })));
      }
      return items;
    });
  }, [filteredServices, listCategories, expandedCategories]);

  const handleSelect = useCallback((item: MenuItemEntity) => {
    onSelect(item);
    setSearchText("");
    onClose?.();
  }, [onSelect, onClose]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  }, []);

  const renderItem = useCallback(({ item }: { item: FlatListItem }) => {
    if (item.type === 'category') {
      const category = item.data as CategoryEntity;
      return (
        <CategoryItem
          category={category}
          isExpanded={!!expandedCategories[category.id]}
          onToggle={toggleCategory}
        />
      );
    }
    // item.type === 'service'
    return <ServiceItem service={item.data as MenuItemEntity} onSelect={handleSelect} />;
  }, [expandedCategories, toggleCategory, handleSelect]);

  const keyExtractor = (item: FlatListItem) => item.id;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          onClose={onClose}
          enablePanDownToClose
        >
          <View style={styles.header}>
            <XText variant="headingRegular" color={theme.colors.gray800}>Service</XText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XIcon name="x" width={10} height={10} color={theme.colors.gray800} />
            </TouchableOpacity>
          </View>

          <XInput
            containerStyle={styles.searchContainer}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            iconLeft="search"
            blurOnSubmit={false}
          />

          <BottomSheetFlatList
            data={flatListData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={<XNoDataView />}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={15}
          />
        </BottomSheet>
      </View>
    </Modal>
  );
}

// Bọc component trong React.memo để tối ưu
export default React.memo(SelectServiceScreen);

const createStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1, 
    backgroundColor: theme.colors.overlay
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    borderRadius: 100, 
    padding: theme.spacing.sm, 
    backgroundColor: theme.colors.backroundIconClose
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  contentContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    minHeight: 48,
  },
  serviceItem: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    minHeight: 64,
  },
  serviceContent: {
    paddingVertical: 8,
    paddingLeft: 32,
    paddingRight: 16,
  },
  serviceHeader: {
    flexDirection: "row", 
    alignItems: "flex-start", 
    justifyContent: "space-between",
    width: '100%',
  },
  serviceName: {
    flex: 1, 
    marginRight: 8,
  },
  serviceDuration: {
    textAlign: "right",
  },
  servicePrice: {
    marginTop: 4,
  },
});