import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";

export default function CodeBlock({children, className = ""}) {

    const language = className.replace(/language-/, '');

    return  <Highlight {...defaultProps} theme={theme} code={children} language={language} >
                {({className, style, tokens, getLineProps, getTokenProps}) => (
                    <pre className={className} style={{...style, margin: "5px", padding: "10px", borderRadius: "4px", overflow: "auto"}}>
                        {tokens.map((line, index) => (
                            <div key={line+index} {...getLineProps}>
                                {line.map((token, key) => (
                                    <span key={index+key} {...getTokenProps({token, key})} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
}