import XScreen from "@/shared/components/XScreen"
import DurationFilterDropdown from "../components/DurationFilterDropdown"
import { useReviewStore } from "../stores/reviewStore"
import { useShallow } from "zustand/react/shallow"
import { XColumn } from "@/shared/components/XColumn"
import SummaryReviewHeader from "../components/SummaryReviewHeader"
import { useTheme } from "@/shared/theme"
import StarFilter from "../components/StarFilter"
import ReviewList from "../components/ReviewList"
import { useEffect, useMemo } from "react"
import { stat } from "react-native-fs"
import { navigate } from "@/app/NavigationService"
import { ROUTES } from "@/app/routes"
const listOptions = [
  {label: "Last 7 days", value: 7},
  {label: "Last 14 days", value: 14},
  {label: "Last 30 days", value: 30},
  {label: "Last 60 days", value: 60},
  {label: "Last 90 days", value: 90},
]


export const ReviewScreen = () => {
    const theme = useTheme()
    
    const {
        isLoading,
        selectedFilterDuration, 
        summaryAverageScore, 
        totalScore,
        listOfSurvey,
        starTotal5,
        starTotal4,
        starTotal3,
        starTotal2,
        starTotal1,
        selectedStar,
    } = useReviewStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            selectedFilterDuration: state.selectedFilterDuration,
            summaryAverageScore: state.summaryAverageScore,
            totalScore: state.totalScore,
            listOfSurvey: state.listOfSurvey,
            starTotal5: state.starTotal5,
            starTotal4: state.starTotal4,
            starTotal3: state.starTotal3,
            starTotal2: state.starTotal2,
            starTotal1: state.starTotal1,
            selectedStar: state.selectedStar,
        }))
    )
    const {setSelectedFilterDuration, getSurvey,setSelectedStar, setReplyingSurveyItem} = useReviewStore(
        useShallow((state) => ({
            setSelectedFilterDuration: state.setSelectedFilterDuration,
            getSurvey: state.getSurvey,
            setSelectedStar: state.setSelectedStar,     
            setReplyingSurveyItem: state.setReplyingSurveyItem     
        }))
    )

    const listOfSurveyByStar = useMemo(() => {
        return selectedStar? listOfSurvey.filter((survey) => survey.rating.toString()== selectedStar):listOfSurvey
    },[selectedStar, listOfSurvey])
    useEffect(()=>{
        getSurvey()
    },[])
    return <XScreen loading={isLoading} title="Reviews" haveBottomTabBar={false}>
        <XColumn gap={theme.spacing.md} style={{paddingTop: theme.spacing.md}}>
            <DurationFilterDropdown dropdownOptions={listOptions} 
                selectedApptType={selectedFilterDuration} 
                onSearch={getSurvey}
                onItemSelect={setSelectedFilterDuration}/>

            <SummaryReviewHeader totalReview={totalScore} averageScore={summaryAverageScore}/>
            <StarFilter 
                starTotal1={starTotal1}
                starTotal2={starTotal2}
                starTotal3={starTotal3}
                starTotal4={starTotal4}
                starTotal5={starTotal5}
                selectedStar={selectedStar}
                onItemSelected={setSelectedStar}/>
        </XColumn>
        <ReviewList options={listOfSurveyByStar} onGoToReplyScreen= {(item)=>{
            setReplyingSurveyItem(item) 
            navigate(ROUTES.REPLY_REVIEW)
        }}/>
    </XScreen>
}