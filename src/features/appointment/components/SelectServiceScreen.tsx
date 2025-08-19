import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import type BottomSheetType from "@gorhom/bottom-sheet";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import XInput from "@/shared/components/XInput";
import XText from "@/shared/components/XText";
import XIcon from "@/shared/components/XIcon";
import { useCreateAppointmentStore, createAppointmentSelectors } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { MenuItemEntity } from "../types/MenuItemResponse";
import { CategoryEntity } from "../types/CategoriesResponse";
import XNoDataView from "@/shared/components/XNoDataView";

// simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface SelectServiceScreenProps {
  visible?: boolean;
  onClose?: () => void;
  onSelect?: (item: MenuItemEntity) => void;
}

interface FlatListItem {
  type: 'category' | 'service';
  id: string;
  category?: CategoryEntity;
  service?: MenuItemEntity;
  categoryId?: string;
}

export default function SelectServiceScreen({ 
  visible = true, 
  onClose = () => {}, 
  onSelect = () => {} 
}: SelectServiceScreenProps) {
  const theme = useTheme();
  const sheetRef = useRef<BottomSheetType>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [searchText, setSearchText] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const themedStyles = useMemo(() => styles(theme), [theme]);

  const { listCategories, listItemMenu } = useCreateAppointmentStore(
    useShallow((state) => ({
      listCategories: createAppointmentSelectors.selectListCategories(state),
      listItemMenu: createAppointmentSelectors.selectListItemMenu(state),
    }))
  );

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  // debounce search text to avoid filtering on every keystroke
  const debouncedSearch = useDebounce(searchText, 250);

  const filteredServices = useMemo(() => {
    if (!debouncedSearch.trim()) return listItemMenu;
    return listItemMenu.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, listItemMenu]);

  const flatListData = useMemo(() => {
    const safeCategories = Array.isArray(listCategories) ? listCategories : [];
    return safeCategories.flatMap((category) => {
      const categoryServices = filteredServices.filter(
        (service) => service.categoryId === category.id
      );
      if (categoryServices.length === 0) return [];

      const items: FlatListItem[] = [{
        type: 'category' as const,
        id: `category-${category.id}`,
        category,
      }];

      if (expandedCategories[category.id]) {
        items.push(...categoryServices.map((service): FlatListItem => ({
          type: 'service',
          id: `service-${service.id}`,
          service,
          categoryId: category.id,
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
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const renderItem = useCallback(({ item }: { item: FlatListItem }) => {
    if (item.type === 'category' && item.category) {
      const { category } = item;
      const isExpanded = expandedCategories[category.id];
      return (
        <TouchableOpacity
          onPress={() => toggleCategory(category.id)}
          style={themedStyles.categoryHeader}
          accessibilityLabel={`Toggle category ${category.name}`}
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
    }

    if (item.type === 'service' && item.service) {
      const { service } = item;
      return (
        <TouchableOpacity
          style={themedStyles.serviceItem}
          onPress={() => handleSelect(service)}
          accessibilityLabel={`Select service ${service.name}`}
        >
          <View style={themedStyles.serviceContent}>
            <View style={themedStyles.serviceHeader}>
              <XText 
                numberOfLines={2} 
                variant="bodyRegular" 
                style={themedStyles.serviceName}
              >
                {service.name}
              </XText>
              <XText 
                numberOfLines={2} 
                variant="captionLight" 
                style={themedStyles.serviceDuration}
              >
                {service.duration} mins
              </XText>
            </View>
            <XText variant="bodyLight" style={themedStyles.servicePrice}>
              ${service.regularPrice.toFixed(2)}
            </XText>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  }, [expandedCategories, handleSelect, theme, toggleCategory, themedStyles]);

  const keyExtractor = (item: FlatListItem) => item.id;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={themedStyles.overlay}>
        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          onClose={onClose}
          enablePanDownToClose
          enableDynamicSizing={false}
        >
          <View style={themedStyles.header}>
            <XText variant="headingRegular" color={theme.colors.gray800}>
              Service
            </XText>
            <TouchableOpacity onPress={onClose} style={themedStyles.closeButton}>
              <XIcon name="x" width={10} height={10} color={theme.colors.gray800} />
            </TouchableOpacity>
          </View>

          <View style={themedStyles.searchContainer}>
            <XInput
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              iconLeft="search"
              blurOnSubmit={false}
            />
          </View>

          <BottomSheetFlatList
            data={flatListData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<XNoDataView />}
            style={themedStyles.flatList}
            contentContainerStyle={themedStyles.contentContainer}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={15}
            updateCellsBatchingPeriod={50}
          />
        </BottomSheet>
      </View>
    </Modal>
  );
}

const styles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
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
  flatList: {
    flex: 1,
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
  selectedItem: {
    backgroundColor: theme.colors.primaryOpacity5,
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
    width: "80%",
  },
  serviceDuration: {
    width: "20%", 
    textAlign: "right",
  },
  servicePrice: {
    marginTop: 4,
  },
});
