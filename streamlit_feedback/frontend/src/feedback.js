import React from "react";
import { ThumbsFeedback } from "./ThumbsFeedback";
import { ThumbsWithQualiFeedback } from "./ThumbsWithQualiFeedback";
import { FacesFeedback } from "./FacesFeedback";
import { FacesWithQualiFeedback } from "./FacesWithQualiFeedback";
import { Streamlit } from "streamlit-component-lib"

export function Feedback(props) {
    const submitFeedback = (score, text, fileList = []) => {
        Streamlit.setComponentValue({ type: props.feedbackType, score, text, fileList });
    };

    if (props.feedbackType === "thumbs" && props.optionalTextLabel === null) {
        return (<ThumbsFeedback uploadUrl={props.uploadUrl} submitFeedback={submitFeedback} disableWithScore={props.disableWithScore} align={props.align} />)
    } else if (props.feedbackType === "thumbs" && props.optionalTextLabel !== null && props.maxTextLength === null) {
        return (<ThumbsWithQualiFeedback uploadUrl={props.uploadUrl}  submitFeedback={submitFeedback} optionalTextLabel={props.optionalTextLabel} disableWithScore={props.disableWithScore} align={props.align} />)
    } else if (props.feedbackType === "thumbs" && props.optionalTextLabel !== null && props.maxTextLength) {
        return (<ThumbsWithQualiFeedback uploadUrl={props.uploadUrl}  submitFeedback={submitFeedback} optionalTextLabel={props.optionalTextLabel} maxTextLength={props.maxTextLength} disableWithScore={props.disableWithScore} align={props.align} />)
    } else if (props.feedbackType === "faces" && props.optionalTextLabel === null && props.maxTextLength === null) {
        return (<FacesFeedback uploadUrl={props.uploadUrl}  submitFeedback={submitFeedback} disableWithScore={props.disableWithScore} align={props.align} />)
    } else if (props.feedbackType === "faces" && props.optionalTextLabel !== null && props.maxTextLength === null) {
        return (<FacesWithQualiFeedback uploadUrl={props.uploadUrl}  submitFeedback={submitFeedback} optionalTextLabel={props.optionalTextLabel} disableWithScore={props.disableWithScore} align={props.align} />)
    } else if (props.feedbackType === "faces" && props.optionalTextLabel !== null && props.maxTextLength) {
        return (<FacesWithQualiFeedback uploadUrl={props.uploadUrl}  submitFeedback={submitFeedback} optionalTextLabel={props.optionalTextLabel} maxTextLength={props.maxTextLength} disableWithScore={props.disableWithScore} align={props.align} />)
    } else if (props.feedbackType === "textbox") {
        return (<div />)
    }
}
