import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
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

interface SelectServiceScreenProps {
  visible?: boolean;
  onClose?: () => void;
  onSelect?: (item: MenuItemEntity) => void;
}

export default function SelectServiceScreen({ visible = true, onClose = () => {}, onSelect = (item: MenuItemEntity) => {} }: SelectServiceScreenProps) {
  const theme = useTheme();
  const sheetRef = useRef<BottomSheetType>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [searchText, setSearchText] = useState("");
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

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

  // Lọc dịch vụ theo search
  const filteredMenu = useMemo(() => {
    if (!searchText.trim()) return listItemMenu;
    return listItemMenu.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, listItemMenu]);

  // Gom nhóm theo category
  const groupedByCategory = useMemo(() => {
    const safeCategories = Array.isArray(listCategories) ? listCategories : [];
    return safeCategories.map((cat: CategoryEntity) => ({
      ...cat,
      items: filteredMenu.filter((item) => item.categoryId === cat.id),
    })).filter((cat) => cat.items.length > 0); // chỉ hiển thị category có dịch vụ
  }, [filteredMenu, listCategories]);

  const handleSelect = (item: MenuItemEntity) => {
    onSelect(item);
    setSearchText("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.overlay }} />
      <BottomSheet
        ref={sheetRef}
        index={visible ? 0 : -1}
        snapPoints={snapPoints}
        onClose={onClose}
        enablePanDownToClose
        style={{ borderTopLeftRadius: 100 }}
      >
        {/* HEADER */}
        <View style={styles(theme).header}>
          <XText variant="contentTitle" style={styles(theme).title}>Services</XText>
          <TouchableOpacity onPress={onClose} style={styles(theme).closeButton} accessibilityLabel="Close service selection">
            <XIcon name="x" width={20} height={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles(theme).searchInput}>
          <XInput
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            iconLeft="search"
            blurOnSubmit={false}
          />
        </View>
        {/* LIST GROUPED BY CATEGORY */}
        <BottomSheetScrollView style={{ marginTop: 8 }}>
          {groupedByCategory.length === 0 ? (
            <XNoDataView/>
          ) : (
            groupedByCategory.map((cat) => (
              <View key={cat.id}>
                <TouchableOpacity
                  onPress={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [cat.id]: !prev[cat.id],
                    }))
                  }
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  }}
                  accessibilityLabel={`Toggle category ${cat.name}`}
                >
                  <XText variant="contentTitle">{cat.name}</XText>
                  <XIcon name={expanded[cat.id] ? "caretUp" : "caretDown"} width={22} height={22} color={theme.colors.text} />
                </TouchableOpacity>
                {expanded[cat.id] && cat.items.length > 0 && (
                  <View style={{ backgroundColor: theme.colors.card }}>
                    {cat.items.map((service: MenuItemEntity) => (
                      <TouchableOpacity
                        key={service.id}
                        style={styles(theme).itemContainer}
                        onPress={() => handleSelect(service)}
                        accessibilityLabel={`Select service ${service.name}`}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                          <XText variant="content400" style={{ }}>{service.name}</XText>
                          <XText variant="content300" style={{ color: theme.colors.gray500,}}>{service.duration} mins</XText>
                        </View>
                        <XText style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                          ${service.regularPrice.toFixed(2)}
                        </XText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </Modal>
  );
}

const styles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  title: { color: theme.colors.text },
  itemContainer: {
    paddingVertical: 8,
    paddingLeft: 32,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.card,
  },
  emptyContainer: { padding: 40, alignItems: 'center' },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
