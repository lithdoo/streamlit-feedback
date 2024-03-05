import React, { useState, useEffect } from "react";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Box } from "@mui/material";

import { styled } from '@mui/material/styles';
import TextField from "@mui/material/TextField";

const colors = {
    grey: "#c7d1d3",
    "😀": "#4caf50",
    "🙂": "#6fbf73",
    "😐": "#ff9800",
    "🙁": "#f6685e",
    "😞": "#f44336"
}

const TextFieldcolors = {
    "😀": "success",
    "🙂": "success",
    "😐": "warning",
    "🙁": "error",
    "😞": "error"
}

const StyledCustomInput = styled(InputBase)(
    ({ color }) => `
    width: 60vw;
    font-family: sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    padding: 0px 12px;
    border-radius: 8px;
    color: ${color};
    border: 1px solid ${color};
    background: transparent;
    `
);

const StyledTextField = styled(TextField)(
    ({ color }) => `
        width: 60vw;
        font-family: sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        padding: 0px 12px;
        border-radius: 8px;
        color: ${color};
        border: 1px solid ${color};
        background: transparent;
        `
);

export function FacesWithQualiFeedback(props) {
    const [submitted, setSubmitted] = useState(false);
    const [inputText, setInputText] = useState(null);
    const [faceScore, setFaceScore] = useState(null);
    const [fileList, setFileList] = useState([])

    useEffect(() => {
        if (props.disableWithScore) {
            setSubmitted(true);
            setFaceScore(props.disableWithScore);
        }
    }, [props.disableWithScore])

    const handleFaceClick = (score) => {
        if (score === faceScore) {
            setFaceScore(null);
        } else {
            setFaceScore(score);
        }
    };

    const selectColor = (score) => {
        if (faceScore) {
            if (score === faceScore) {
                return colors[score]
            } else {
                if (submitted) {
                    return "transparent"
                } else {
                    return colors["grey"]
                }
            }
        } else {
            return colors["grey"]
        }
    }

    const selectHoverColor = (score) => {
        if (faceScore) {
            if (score === faceScore) {
                return colors[score]
            } else {
                if (submitted) {
                    return "transparent"
                } else {
                    return colors[score]
                }
            }
        } else {
            return colors[score]
        }
    }

    const handleTextInput = (text) => {
        setInputText(text.currentTarget.value);
    };

    const handleSubmission = () => {
        setSubmitted(true);
        props.submitFeedback(faceScore, inputText, fileList);
    };

    const addFile = (e) => {
        console.log(e)
        const input = e.target
        console.log(input.files[0])
        if (input.files[0]) {
            setFileList([...fileList, input.files[0]])
        }

        input.value = ''
    }

    const removeFile = (file) => {
        setFileList(fileList.filter(v => v !== file))
    }

    if (props.maxTextLength != null) {
        return (
            <Box paddingY={0.5} height={180} component="form" sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }} noValidate autoComplete="off">
                <Stack direction="row" style={{ position: 'relative' }} spacing={1} justifyContent={props.align}>
                    <div style={{ position: 'absolute', left: "8px", width: "178px", border: "0px solid #ccc", bottom: '8px', top: '32px' ,overflow:'auto'}}>
                        {
                            fileList.map(file => <div style={{
                                fontSize: '14px',
                                display: 'flex'
                            }}>
                                <div style={{ flex: '1 1 0', textOverflow: "ellipsis", overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    <a download href={URL.createObjectURL(file)}>{file.name}</a>
                                </div>
                                <div style={{ flex: '0 0 auto' }}>
                                    <div style={{cursor:'pointer'}} onClick={() => removeFile(file)}>删除</div>
                                </div>
                            </div>)
                        }
                    </div>
                    <SentimentVeryDissatisfiedIcon
                        titleAccess="非常不满意"
                        sx={{
                            fontSize: 28,
                            color: selectColor("😞"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("😞"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("😞")}
                    />
                    <SentimentDissatisfiedIcon
                        titleAccess="不满意"
                        sx={{
                            fontSize: 28,
                            color: selectColor("🙁"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("🙁"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("🙁")}
                    />
                    <SentimentNeutralIcon
                        titleAccess="一般"
                        sx={{
                            fontSize: 28,
                            color: selectColor("😐"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("😐"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("😐")}
                    />
                    <SentimentSatisfiedIcon
                        titleAccess="满意"
                        sx={{
                            fontSize: 28,
                            color: selectColor("🙂"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("🙂"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("🙂")}
                    />
                    <SentimentSatisfiedAltIcon
                        titleAccess="非常满意"
                        sx={{
                            fontSize: 28,
                            color: selectColor("😀"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("😀"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("😀")}
                    />


                    {
                        submitted === false && faceScore !== null
                            ? <div>
                                <StyledTextField id="outlined-multiline-static" inputProps={{ maxLength: props.maxTextLength }} onChange={handleTextInput} multiline rows={4} placeholder={props.optionalTextLabel} aria-label="Demo input" color={TextFieldcolors[faceScore]} />
                                <Button style={{ marginLeft: '20px' }} sx={{ color: colors[faceScore] }} variant="text" size="small">
                                    <label htmlFor="upload">上传文件</label>
                                    <input id="upload" type="file" style={{ display: 'block', width: '0', height: '0' }} onChange={e => addFile(e)}></input>
                                </Button>
                            </div>
                            : null
                    }
                    {submitted === false && faceScore !== null ? <Button sx={{ color: colors[faceScore] }} variant="text" size="small" onClick={handleSubmission}>Submit</Button> : null}
                </Stack>
            </Box>
        )
    }
    else {

        return (
            <Box paddingY={0.5}>
                <Stack direction="row" spacing={1} justifyContent={props.align}>
                    <SentimentVeryDissatisfiedIcon
                        sx={{
                            fontSize: 28,
                            color: selectColor("😞"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("😞"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("😞")}
                    />
                    <SentimentDissatisfiedIcon
                        sx={{
                            fontSize: 28,
                            color: selectColor("🙁"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("🙁"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("🙁")}
                    />
                    <SentimentNeutralIcon
                        sx={{
                            fontSize: 28,
                            color: selectColor("😐"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("😐"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("😐")}
                    />
                    <SentimentSatisfiedIcon
                        sx={{
                            fontSize: 28,
                            color: selectColor("🙂"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("🙂"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("🙂")}
                    />
                    <SentimentSatisfiedAltIcon
                        sx={{
                            fontSize: 28,
                            color: selectColor("😀"),
                            '&:hover': {
                                cursor: submitted ? null : "pointer",
                                color: selectHoverColor("😀"),
                            },
                        }}
                        onClick={() => submitted ? {} : handleFaceClick("😀")}
                    />
                    {submitted === false && faceScore !== null ? <StyledCustomInput onChange={handleTextInput} aria-label="Demo input" placeholder={props.optionalTextLabel} color={colors[faceScore]} /> : null}
                    {submitted === false && faceScore !== null ? <Button sx={{ color: colors[faceScore] }} variant="text" size="small" onClick={handleSubmission}>Submit</Button> : null}
                </Stack>
            </Box>
        )
    }
}