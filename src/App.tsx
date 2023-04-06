import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TextAreaWithTooltip } from './test';

function App() {
  // const [inputVal, setInputVal] = useState('')

  const [isTooltipEnabled, setTooltipFlag] = useState(false)
  const textAreaRef = useRef<any>(null);
  let tooltipRef: HTMLDivElement;

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [textBoxValue, setTetBoxValue] = useState('')
  const [textSize, setTextSize] = useState(0);

  useEffect(() => {
    const ele = textAreaRef.current.getBoundingClientRect();
    setPosition({ x: ele.left + 3, y: ele.top })
  }, [])

  useEffect(() => {
    if (!textBoxValue) {
      setTooltipFlag(false)
    }
  }, [textBoxValue])

  // function handleChange(event: any) {
  //   if (textAreaRef.current) {

  //     console.log('event', event)

  //     const caretIndex = textAreaRef.current.selectionStart;

  //     const fontsize = Number(window.getComputedStyle(textAreaRef.current).fontSize.split('px')[0])
  //     console.log('fontsize', fontsize);

  //     const boundingClientRect = textAreaRef.current.getBoundingClientRect();
  //     const x = boundingClientRect.left + textAreaRef.current.scrollLeft;
  //     const y = boundingClientRect.top + textAreaRef.current.scrollTop


  //     console.log('text', event.target.value.substring(0, caretIndex), event.target.value.substring(0, caretIndex).length)
  //     const caretX = boundingClientRect.left + (event.target.value.substring(0, caretIndex).length * (fontsize * 2));
  //     const caretY = y + 20; // adjust as needed for your font-size

  //     console.log('boundingClientRect', boundingClientRect);
  //     console.log(' caret X', caretX, '  y:', caretY);
  //   }
  // }

  // const handleMouseMove = (event: any) => {
  //   if (textAreaRef.current) {
  //     console.log('event', event.clientX, event.clientY)

  //     const { x, y } = textAreaRef.current.getBoundingClientRect();
  //     const cursorX = event.clientX - x;
  //     const cursorY = event.clientY - y;
  //     console.log('Cursor position:', cursorX, cursorY);
  //   }

  // };

  function handleChanges(event: any) {
    const inputElement = event.target;

    const caretPosition = inputElement.selectionStart; // number of words 
    const inputRect = inputElement.getBoundingClientRect(); // gets the input field details

    const font = window.getComputedStyle(inputElement).font;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (textAreaRef.current) {
      const y = inputRect.top + textAreaRef.current.scrollTop;
    }

    if (event.key !== 'Enter') {
      if (ctx) {
        ctx.font = font;
        const textBeforeCaret = inputElement.value.substring(0, caretPosition);
        const textWidth = ctx.measureText(textBeforeCaret).width;

        // need to add this condition in useEffect for future use to set the textsize
        if (inputElement.value.length === 1) {
          console.log('textWidth', textWidth)
          setTextSize(textWidth) // this condition for onChange
        } else if (textSize === 0) {
          setTextSize(ctx.measureText(inputElement.value[0]).width) // this condition for copy paste
        }
        let maxLetterInLine = (inputRect.width / textSize) - 1; // -1 needs to update based on border radius

        let xPosition = 0;
        let yPosition = 0;

        if (inputElement.nodeName === 'INPUT') { // For Input Field
          yPosition = inputRect.top - 20;
          if ((inputRect.left + textWidth) <= inputRect.right) {
            xPosition = inputRect.left + textWidth;
          } else {
            xPosition = inputRect.right
          }
        }
        else { // For TextArea Field
          if ((textWidth / textSize) <= maxLetterInLine) { // For first Line
            xPosition = inputRect.left + textWidth;
            yPosition = inputRect.top - 20;
          }
          else { // For rest of the lines

            const index = Math.floor((textWidth / textSize) / (maxLetterInLine)); // to find the line number where care is in active
            xPosition = (textWidth - (inputRect.width * index)) + inputRect.left

            const boundingClientRect = textAreaRef.current.getBoundingClientRect();
            const y = boundingClientRect.top + textAreaRef.current.scrollTop;
            yPosition = inputRect.top - 10;
          }
        }

        if (inputElement.clientHeight < inputElement.scrollHeight && inputElement.nodeName !== 'INPUT') { // handles last line of text area
          yPosition = inputRect.bottom - 42
        }
        console.log('event', event.onKeyDown);

        if (event.key) {
          setPosition({ x: xPosition, y: yPosition })
        }
        if (tooltipRef) {
          tooltipRef.style.cssText = `top:${yPosition}px; left:${xPosition}px`
        }

      }


    }
  }

  // const handleNewLine = (event: any) => {
  //   const inputElement = event.target;
  //   const inputRect = inputElement.getBoundingClientRect(); // gets the input field details

  //   if (event.key == 'Enter' && inputElement.nodeName !== 'INPUT') { // handles Enter
  //     const xPosition = inputRect.left;
  //     console.log('position', xPosition)
  //     tooltipRef.style.cssText = `top:${position.y}px; left:${xPosition}px`
  //   }
  // }

  return (
    <>
      Test data may be produced by the tester, or by a program or function that aids the tester. Test data may be recorded for reuse or used only once.
      Test data can be created manually, by using data generation tools (often based on randomness), or be retrieved from an existing production environment.
      <div className="App">
        <textarea
          id='textArea'
          rows={4}
          ref={textAreaRef}
          cols={50}
          className='textArea_style'
          onBlur={() => { setTooltipFlag(false) }}
          placeholder="Describe yourself here..."
          // onKeyDown={(e) => { handleChanges(e); handleNewLine(e) }}
          onChange={(e) => {
            setTooltipFlag(true);
            setTetBoxValue(e.target.value);
            handleChanges(e);
          }}
        />
      </div>

      <input ref={textAreaRef} onChange={(e) => { setTooltipFlag(true); setTetBoxValue(e.target.value); handleChanges(e) }} />

      {isTooltipEnabled ? <div className='tooltip-div' ref={(refEle) => {
        if (refEle) {
          tooltipRef = refEle
        }
      }}
      >
        test tooltip
      </div> : null}
      <div>
        {/* <textarea
          onChange={handleChange}
        /> */}
      </div>

    </>
  )
}

export default App
