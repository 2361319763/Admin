import React, { useEffect, useRef, useState, memo } from 'react';
import { Button } from 'antd';
import hljs from './highlight';
import { BasicStyleWrap, CodeStyleWrap, MathStyleWrap } from './basic';
import "./index.scss";

type CodeBlockProps = {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = memo(({ language, code }) => {
  const preRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const handleClip = () => {
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.setAttribute('readonly', 'readonly');
    textarea.value = code;
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopied(true)
    setTimeout(()=>{
      setCopied(false)
    },2000)
  }

  const initNumber = () => {
    const blocks = document.querySelectorAll('pre code');
    const codeHljs = document.querySelector('code.hljs');
    const html = codeHljs?.innerHTML || '';
    const size = html.split('\n').length;
    let ul = document.createElement('ul');
    for (let i = 1; i <= size; i++) {
      let li = document.createElement('li');
      li.innerText = i + '';
      ul.appendChild(li);
    }
    ul.classList.add('hljs-code-number');
    blocks.forEach((block) => {
      block.innerHTML = ul.outerHTML + `<ul class='hljs-code-ul'>${block.innerHTML}</ul>`;
    });
  };

  useEffect(() => {
    if (preRef.current) {
      preRef.current.removeAttribute('data-highlighted');
      hljs.highlightElement(preRef.current);
      code && initNumber();
    }
  }, [language, code]);

  return (
    <div className="code-block" style={{ position: 'relative', marginTop: 8, minWidth: '60vw' }}>
      <BasicStyleWrap>
        <MathStyleWrap>
          <CodeStyleWrap>
            <pre>
              <code 
                ref={preRef} 
                id={language} 
                className={language}
                style={{display:'flex'}}
              >
                {code}
              </code>
            </pre>
          </CodeStyleWrap>
        </MathStyleWrap>
      </BasicStyleWrap>
      {
        code && <Button onClick={()=>{handleClip()}} className='copy_btn'>
          {copied ? '已复制' : '复制'}
        </Button>
      }
    </div>
  );
})

export default CodeBlock;