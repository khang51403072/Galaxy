import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type BottomSheetType from "@gorhom/bottom-sheet";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import XInput from "@/shared/components/XInput";
import XText from "@/shared/components/XText";
import XIcon from "@/shared/components/XIcon";
import { useCreateAppointmentStore, createAppointmentSelectors } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { MenuItemEntity } from "../types/MenuItemResponse";
import { CategoryEntity } from "../types/CategoriesResponse";

export default function SelectServiceScreen({ visible = true, onClose = () => {}, onSelect = (item: MenuItemEntity) => {} }) {
  const theme = useTheme();
  const sheetRef = useRef<BottomSheetType>(null);
  const snapPoints = useMemo(() => ["75%"], []);
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
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      style={{borderTopLeftRadius: 100}}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <XText variant="contentTitle" style={styles.title}>Chọn dịch vụ</XText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <XIcon name="x" width={20} height={20} color="#999" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchInput}>
        <XInput
          placeholder="Tìm kiếm dịch vụ..."
          value={searchText}
          onChangeText={setSearchText}
          iconLeft="search"
          blurOnSubmit={false}
        />
      </View>
      {/* LIST GROUPED BY CATEGORY */}
      <BottomSheetScrollView style={{ marginTop: 8 }}>
        {groupedByCategory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <XText style={styles.emptyText}>
              {searchText.trim() === '' ? 'Không có dịch vụ nào' : 'Không tìm thấy kết quả'}
            </XText>
          </View>
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
                  backgroundColor: '#fafbfc',
                }}
              >
                <XText variant="content400">{cat.name}</XText>
                <XText>{expanded[cat.id] ? "▲" : "▼"}</XText>
              </TouchableOpacity>
              {expanded[cat.id] && cat.items.length > 0 && (
                <View style={{ backgroundColor: "#fff" }}>
                  {cat.items.map((service: MenuItemEntity) => (
                    <TouchableOpacity
                      key={service.id}
                      style={styles.itemContainer}
                      onPress={() => handleSelect(service)}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <XText style={styles.itemText}>{service.name}</XText>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <XText style={{ color: theme.colors.gray500, fontSize: 12 }}>{service.duration} mins</XText>
                        <XText style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                          ${service.regularPrice.toFixed(2)}
                        </XText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  itemContainer: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: { fontSize: 16 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#888' },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
