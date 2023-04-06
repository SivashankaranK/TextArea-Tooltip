import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useState } from 'react';

export const TextAreaWithTooltip=()=> {
    const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });

    const handleTextAreaClick = (e: any) => {
        const { clientX, clientY } = e;
        setCaretPosition({ x: clientX, y: clientY });
    };

    const handleTextAreaMouseMove = (e: any) => {
        const { clientX, clientY } = e;
        setCaretPosition({ x: clientX, y: clientY });
    };

    const handleInputChange = (e: any) => {
        // Update the caret position whenever the input changes
        const { target } = e;
        const { selectionStart } = target;
        const rect = target.getBoundingClientRect();
        const { left, top } = rect;
        const caretX = left + target.clientWidth / 20 + selectionStart * 10;
        const caretY = top + target.clientHeight / 2;
        setCaretPosition({ x: caretX, y: caretY });
    };

    return (
        <Form>
            <InputGroup>
                <FormControl
                    as="textarea"
                    onClick={handleTextAreaClick}
                    onMouseMove={handleTextAreaMouseMove}
                    onChange={handleInputChange}
                // other props
                />
                <OverlayTrigger
                    overlay={
                        <Tooltip id="tooltip">
                            Tooltip text
                        </Tooltip>
                    }
                    placement="top"
                    show={Boolean(caretPosition)}
                    containerPadding={20}
                >
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>

                </OverlayTrigger>
            </InputGroup>
        </Form>
    );
}
