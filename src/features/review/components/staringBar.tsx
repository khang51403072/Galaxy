import XIcon from "@/shared/components/XIcon";
import { XRow } from "@/shared/components/XRow";
import { useTheme } from "@/shared/theme";
import { memo } from "react";
interface Props{
    score: number
}
export const StaringBar = memo(
    ({score}:Props)=> {
        const theme = useTheme()
        return <XRow>
            {/* 
                1. Array.from({ length: numberOfIcons }): 
                Tạo ra một mảng có 5 phần tử `[undefined, undefined, undefined, undefined, undefined]`.
                2. .map((_, index) => ...): 
                Lặp qua mảng này. Chúng ta không quan tâm đến giá trị (`_`), chỉ cần chỉ số `index`.
                3. <XIcon key={index} ... />:
                Với mỗi lần lặp, trả về một component XIcon. `key={index}` là bắt buộc để React
                có thể nhận diện và quản lý các phần tử trong danh sách một cách hiệu quả.
            */}
            {Array.from({ length: 5 }).map((_, index) => (
                <XIcon 
                    key={index} 
                    name= {index+1 <= score? "starFilled":"starOutline"} // Tên icon của bạn
                    width={18} 
                    height={18} 
                    color={theme.colors.yellow}
                
                />
            ))}
        </XRow>
    }
)