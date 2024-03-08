import React, { useState, useEffect, useRef } from "react";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Box, Tooltip } from "@mui/material";

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
    const fileListRef = useRef([])
    const [submitted, setSubmitted] = useState(false);
    const [inputText, setInputText] = useState(null);
    const [faceScore, setFaceScore] = useState(null);
    const [fileList, setFileList] = useState(fileListRef.current)

    const uploadUrl = props.uploadUrl

    console.log('uploadUrl', uploadUrl)

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
        props.submitFeedback(faceScore, inputText, fileList.map(v => v.fileId).filter(v => !!v));
    };

    const addFile = async (e) => {
        console.log(e)
        const input = e.target
        console.log(input.files[0])
        const file = input.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            fileListRef.current = [...fileListRef.current, { file, url, fileId: null }]
            setFileList(fileListRef.current)
        }
        input.value = ''

        try {
            const id = await uploadFile(file)
            finishUpload(id, file)
        } catch (e) {
            alert(e)
            finishUpload(null, file)
        }
    }

    const removeFile = (file) => {
        fileListRef.current = fileListRef.current.filter(v => v.file !== file)
        setFileList(fileListRef.current)
    }

    const uploadFile = async (file) => {

        if (!uploadUrl) {
            await new Promise((res) => setTimeout(() => {
                res()
            }, 3000))
            return Math.random().toString()
        }

        const formData = new FormData()
        formData.set('name', file.name)
        formData.set('file', file)

        const res = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })

        const json = await res.json()

        if (!json.fileId) throw new Error('Upload Error: fileId is blank!!!')

        return json.fileId
    }

    const finishUpload = (id, file) => {
        console.log({ id, file })
        const list = fileListRef.current.map((item) => {
            if (item.file === file) {
                if (id) {
                    return { ...item, fileId: id }
                } else {
                    return null
                }
            } else {
                return item
            }
        })

        fileListRef.current = list

        setFileList(fileListRef.current)
    }

    if (props.maxTextLength != null) {
        return (
            <Box paddingY={0.5} height={240} component="form" sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }} noValidate autoComplete="off">
                <Stack direction="row" style={{ position: 'relative' }} spacing={1} justifyContent={props.align}>
                    <Tooltip title="非常不满意">
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
                    </Tooltip>
                    <Tooltip title="不满意">
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
                    </Tooltip>
                    <Tooltip title="一般">
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
                    </Tooltip>

                    <Tooltip title="满意">
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
                    </Tooltip>

                    <Tooltip title="非常满意">
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
                    </Tooltip>

                    {
                        submitted === false && faceScore !== null
                            ? <div>
                                <StyledTextField id="outlined-multiline-static" inputProps={{ maxLength: props.maxTextLength }} onChange={handleTextInput} multiline rows={4} placeholder={props.optionalTextLabel} aria-label="Demo input" color={TextFieldcolors[faceScore]} />
                                <div>
                                    <Button style={{ marginLeft: '20px' }} sx={{ color: colors[faceScore] }} variant="text" size="small">
                                        <label style={{ marginBottom: '0' }} htmlFor="upload">上传文件</label>
                                        <input id="upload" type="file" style={{ display: 'block', width: '0', height: '0' }} onChange={e => addFile(e)}></input>
                                    </Button>
                                </div>
                                <div style={{ overflow: 'auto', padding: '0 20px', height: '63px' }}>{
                                    fileList.map(({ file, fileId, url }) => <div key={url} style={{
                                        fontSize: '14px',
                                        display: 'flex'
                                    }}>
                                        <div style={{ flex: '1 1 0', textOverflow: "ellipsis", overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {
                                                fileId
                                                    ? <a download href={URL.createObjectURL(file)}>{file.name}</a>
                                                    : <span className="uploading">uploading....</span>
                                            }
                                        </div>
                                        <div style={{ flex: '0 0 auto' }}>
                                            <div style={{ cursor: 'pointer' }} onClick={() => removeFile(file)}>删除</div>
                                        </div>
                                    </div>)
                                }</div>
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