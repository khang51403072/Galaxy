import XScreen from "@/shared/components/XScreen"
import DurationFilterDropdown from "../components/DurationFilterDropdown"
import { useReviewStore } from "../stores/reviewStore"
import { useShallow } from "zustand/react/shallow"
import { XColumn } from "@/shared/components/XColumn"
import SummaryReviewHeader from "../components/SummaryReviewHeader"
import { useTheme } from "@/shared/theme"
import StarFilter from "../components/StarFilter"
import ReviewList from "../components/ReviewList"
import { useCallback, useEffect, useMemo } from "react"
import { stat } from "react-native-fs"
import { goBack, navigate } from "@/app/NavigationService"
import { ROUTES } from "@/app/routes"
import { SurveyItem } from "../types/ReviewResponse"
import XText from "@/shared/components/XText"
import { XRow } from "@/shared/components/XRow"
import { StaringBar } from "../components/staringBar"
import { Permissions } from "@/features/auth/types/AuthTypes"
import { View } from "react-native"
import { MultiLineInput } from "../components/ReplyTextInput"
import XSwitch from "@/shared/components/XSwitch"
import XButton from "@/shared/components/XButton"
import { isSuccess } from "@/shared/types/Result"
import { useXAlert } from "@/shared/components/XAlertContext"
import XIcon from "@/shared/components/XIcon"
export const ReplyReviewScreen = () => {
    const theme = useTheme()

    const {
        isLoading,
        replyingSurveyItem,
        replyContent,
        isSendSMS,
        isSendMail,
    } = useReviewStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            replyingSurveyItem: state.replyingSurveyItem,
            replyContent: state.replyContent,
            isSendSMS: state.isSendSMS,
            isSendMail: state.isSendMail,

        }))
    )
    const { 
        getPermission, setReplyContent, setIsSendSMS,
        setIsSendMail, sendRespond, getSurvey 
    } = useReviewStore(
            useShallow((state) => ({
                getPermission: state.getPermission,
                setReplyContent: state.setReplyContent,
                setIsSendSMS: state.setIsSendSMS,
                setIsSendMail: state.setIsSendMail,
                sendRespond: state.sendRespond,
                getSurvey: state.getSurvey
            }))
        )

    const renderItem = useMemo(
        () => {
            if (!replyingSurveyItem) return <XText></XText>
            return <XColumn gap={theme.spacing.sm}
                style={{
                    paddingVertical: theme.spacing.md,
                    borderColor: theme.colors.primaryOpacity50,
                    borderWidth: 1,
                    paddingHorizontal: theme.spacing.sm,
                    borderRadius: theme.spacing.sm
                }}>
                <XRow justify="space-between" align="center">
                    <XText color={theme.colors.gray800} variant="titleRegular">
                        {getPermission(Permissions.VIEW_CUSTOMER_NAME)
                            ? `${replyingSurveyItem.customerInfo.firstName} ${replyingSurveyItem.customerInfo.lastName}`
                            : "********"}
                    </XText>
                    <XText color={theme.colors.gray600} variant="captionLight">
                        #{replyingSurveyItem.ticketNum}
                    </XText>
                </XRow>

                {replyingSurveyItem.customerInfo.phone && (
                    <XText color={theme.colors.gray500} variant="captionLight">
                        {getPermission(Permissions.VIEW_PHONE_NUMBER_EMAIL) ? `${replyingSurveyItem.customerInfo.phone}` : "**********"}
                    </XText>
                )}

                <XRow justify="space-between" align="center">
                    <StaringBar score={replyingSurveyItem.rating} />
                    <XText color={theme.colors.gray600} variant="captionLight">
                        {replyingSurveyItem.createdAt.toDate()?.format("dd/MM/yyyy")} at {replyingSurveyItem.createdAt.toDate()?.format("HH:mm a")}
                    </XText>
                </XRow>

                {replyingSurveyItem.comment && (
                    <XText style={{ marginTop: theme.spacing.xs }} variant="titleLight">
                        {replyingSurveyItem.comment}
                    </XText>
                )}
            </XColumn>
                ;
        },
        [theme]
    );

    const { showAlert } = useXAlert()
    const onConfirm = useCallback(
        async () => {
            const message = await sendRespond();
            if (message.length == 0) {
                showAlert({
                    title: "Success",
                    message: "Your response has been\nsent to the customer.",
                    type: "success",
                    onClose() {
                        goBack();
                        getSurvey()
                    },
                })
            }
            else {
                showAlert({
                    title: "Error",
                    message: message,
                    type: "error"
                })
            }
        }, []
    )
    const {showConfirm} = useXAlert()
    const showconfirmDialog = useCallback(
        () => {
            if(replyContent.length==0) 
                return showAlert({
                    title: "Error",
                    message: "Please enter a message respond!",
                    type: "error"
                })
            if(!isSendSMS && !isSendMail)
                return showAlert({
                    title: "Error",
                    message: "Please chose at least one method to send: Email or SMS!",
                    type: "error"
                })
            showConfirm({
                title: 'Once sent, your response \ncannot be edited.',
                message: 'Do you want to continue?',
                confirmText: 'YES',
                cancelText: 'NO',
                onConfirm: onConfirm,
                onCancel: ()=>{},
                childrenTop: <XRow align="center" justify="center"><XIcon height={32} width={32}  name={"confirmRespondReview"}></XIcon></XRow>
            })
        },[isSendSMS,isSendMail,replyContent]
    );

    const buttonConfirm = useMemo(
        () => {
            return <XRow gap={theme.spacing.sm} style={{ paddingHorizontal: theme.spacing.xs }}>
                <XButton title="Cancel" backgroundColor={theme.colors.gray200}
                    defaultTextColor={theme.colors.gray800}
                    style={{ flex: 1 }} onPress={()=>goBack()}></XButton>
                <XButton title="Respond" style={{ flex: 1 }} onPress={showconfirmDialog}></XButton>
            </XRow>
        }, []
    )

    return <XScreen dismissKeyboard loading={isLoading} title="Respond Review" haveBottomTabBar={false}
        footer={buttonConfirm}>
        <XColumn gap={theme.spacing.md} style={{ paddingTop: theme.spacing.md }}>
            <XColumn gap={theme.spacing.xs}>
                <XText variant="titleRegular" color={theme.colors.gray700}>Review</XText>
                {renderItem}
            </XColumn>
            <XColumn gap={theme.spacing.xs}>
                <XRow align="center" justify="space-between">
                    <XText variant="titleRegular" color={theme.colors.gray700}>Your Response {<XText color="red">*</XText>}</XText>
                    <XText color={theme.colors.gray400} variant="captionLight">{replyContent.length}/4000</XText>
                </XRow>
                <MultiLineInput text={replyContent} setText={setReplyContent} />
            </XColumn>

            <XRow justify="space-between" align="center">
                <XText>Send SMS</XText>
                <XSwitch value={isSendSMS} onValueChange={setIsSendSMS} />
            </XRow>
            <XRow justify="space-between" align="center">
                <XText>Send Email</XText>
                <XSwitch value={isSendMail} onValueChange={setIsSendMail} />
            </XRow>
        </XColumn>

    </XScreen>
}