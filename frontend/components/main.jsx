/**
 * Created by noonon on 6/12/16.
 */

module.exports = React => {

    require('style/main.styl');

    return React.createClass({
        getInitialState: function () {
            var container = document.querySelector('.container'),
                height = container.offsetHeight,
                width = container.offsetWidth,
                contentWidth = Math.floor(width * 0.8 * 0.5),
                contentHeight = Math.floor((height * 0.8 - (width * 0.2)));

            return {
                height: height,
                width: width,
                minWidth: 200,
                minHeight: 100,
                fontSize: 16,
                lineHeight: 16,
                contentHeight: contentHeight,
                contentWidth: contentWidth
            }
        },

        mouseUp: function () {

            if (this.state.bottom || this.state.right) {

                this.setState({
                    bottom: undefined,
                    right: undefined
                });
            }

            return false;
        },

        copyToClipboard: function (text) {
            if (window.clipboardData && window.clipboardData.setData) {
                return clipboardData.setData("Text", text);

            } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                var textarea = document.createElement("textarea");

                textarea.textContent = text;
                textarea.style.position = "fixed";
                document.body.appendChild(textarea);
                textarea.select();

                try {
                    return document.execCommand("copy");
                } catch (ex) {
                    console.warn("Copy to clipboard failed.", ex);
                    return false;
                } finally {
                    document.body.removeChild(textarea);
                }
            }
        },


        mouseDown: function (type, event) {
            var stateObject = (type === "bottom") ? {bottom: event.nativeEvent.clientY} : {right: event.nativeEvent.clientX};

            this.setState(stateObject);

            return false;
        },

        changeCanvas: function (mainParam, step) {

            return mainParam - step;
        },

        getText: function (text = '') {
            var padding = (this.state.paddingText || 25) * 2,
                textConteinerHeight = (this.state.contentHeight - padding),
                textContainerWidth = (this.state.contentWidth - padding),
                strings = (textConteinerHeight / this.state.lineHeight).toFixed(),
                chars, lastChar, newText = '', position = 0, lastPosition,
                charsInString = Math.ceil(textContainerWidth / (this.state.fontSize * .5));

            for (var i = strings; i > 0; i--) {
                chars = text.substring(position, (position + charsInString));
                lastChar = chars[chars.length - 1];


                if (lastChar == ' ') {
                    position += chars.length;
                } else {
                    lastPosition = chars.split(' ');

                    lastPosition = lastPosition[lastPosition.length - 1];
                    lastPosition = chars.length - lastPosition.length;
                    position += lastPosition;
                    chars = chars.substring(0, lastPosition)
                }

                newText += (i !== 1) ? chars + ' ' : chars + '...';
            }


            return {
                text: newText,
                strings: strings,
                width: textContainerWidth,
                height: textConteinerHeight - (textConteinerHeight % this.state.lineHeight)
            };
        },


        mouseMove: function (event) {
            var state = this.state, stateObject, stepParam, textParam;

            if (state.bottom !== undefined) {
                stepParam = (state.bottom - event.clientY);

                var height = this.changeCanvas(state.contentHeight, stepParam);

                if (height >= this.state.minHeight) {
                    stateObject = {
                        bottom: event.clientY,
                        contentHeight: height
                    };

                    this.setState(stateObject);
                }

            } else if (state.right !== undefined) {
                stepParam = (state.right - event.clientX);

                var width = this.changeCanvas(state.contentWidth, stepParam);

                if (width >= this.state.minWidth) {

                    stateObject = {
                        right: event.clientX,
                        contentWidth: width
                    };

                    this.setState(stateObject);
                }
            }

            return false;
        }
        ,

        componentDidMount: function () {
            var content = document.querySelector('.fishtext__workflow-content-canvas-text-block');

            document.addEventListener('mouseup', this.mouseUp);
            document.addEventListener('mousemove', this.mouseMove);
            this.getData();

            this.setState({
                paddingText: content.offsetLeft
            })
        }
        ,


        componentWillUnmount: function () {
            document.removeEventListener('mouseup', this.mouseUp);
            document.removeEventListener('mousemove', this.mouseMove);
        }
        ,

        onClickButton: function (text) {
            this.copyToClipboard(text)
        },

        getData: function () {

            var ajax = new XMLHttpRequest();

            ajax.open('GET', 'api/text', true);
            ajax.onreadystatechange = function () {
                if (ajax.status === 200 && ajax.readyState == 4) {
                    var data = JSON.parse(ajax.responseText);

                    this.setState(data)
                }
            }.bind(this);
            ajax.send()
        },

        render: function () {

            console.log(this.state.text);

            var textParams = this.getText(this.state.text),
                contentWidth = `${textParams.width}px`,
                contentHeight = `${textParams.height}px`,
                words = (textParams.text.split(' ')).length,
                canvasStyle = {
                    height: this.state.contentHeight,
                    width: this.state.contentWidth
                },
                textStyle = {
                    lineHeight: `${this.state.lineHeight}px`,
                    fontSize: `${this.state.fontSize}px`,
                    height: contentHeight
                };

            return <div className="fishtext">
                <div className="fishtext__workflow">
                    <div className="fishtext__workflow-content">
                        <div style={canvasStyle} className="fishtext__workflow-content-canvas">
                            <div className="fishtext__workflow-content-canvas-string">
                                <div className="fishtext__workflow-content-canvas-string-field">
                                    <div
                                        className="fishtext__workflow-content-canvas-string-field-block">{textParams.strings}</div>
                                </div>
                                <div className="fishtext__workflow-content-canvas-string-text">строки</div>
                            </div>
                            <div className="fishtext__workflow-content-canvas-words">
                                <div className="fishtext__workflow-content-canvas-words-field">
                                    <div className="fishtext__workflow-content-canvas-words-field-block">{words}</div>
                                </div>
                                <div className="fishtext__workflow-content-canvas-words-text">слово</div>
                            </div>
                            <div className="fishtext__workflow-content-canvas-height">
                                <div className="fishtext__workflow-content-canvas-height-text">высота</div>
                                <div className="fishtext__workflow-content-canvas-height-field">
                                    <div
                                        className="fishtext__workflow-content-canvas-height-field-block">{contentHeight}</div>
                                </div>
                            </div>
                            <div className="fishtext__workflow-content-canvas-width">
                                <div className="fishtext__workflow-content-canvas-width-field">
                                    <div className="fishtext__workflow-content-canvas-width-field-block">
                                        <div
                                            className="fishtext__workflow-content-canvas-width-field-block">{contentWidth}
                                        </div>
                                    </div>
                                </div>
                                <div className="fishtext__workflow-content-canvas-width-text">ширина</div>
                            </div>
                            <div onMouseDown={ this.mouseDown.bind(this, 'right')}
                                 className="fishtext__workflow-content-canvas-right">
                                <div className="fishtext__workflow-content-canvas-right-lines">
                                    <div className="fishtext__workflow-content-canvas-right-lines-line"></div>
                                    <div className="fishtext__workflow-content-canvas-right-lines-line"></div>
                                    <div className="fishtext__workflow-content-canvas-right-lines-line"></div>
                                </div>
                            </div>
                            <div onMouseDown={ this.mouseDown.bind(this, 'bottom')}
                                 className="fishtext__workflow-content-canvas-bottom">
                                <div className="fishtext__workflow-content-canvas-bottom-lines">
                                    <div className="fishtext__workflow-content-canvas-bottom-lines-line"></div>
                                    <div className="fishtext__workflow-content-canvas-bottom-lines-line"></div>
                                    <div className="fishtext__workflow-content-canvas-bottom-lines-line"></div>
                                </div>
                            </div>
                            <div className="fishtext__workflow-content-canvas-text">
                                <div style={textStyle}
                                     className="fishtext__workflow-content-canvas-text-block">
                                    {textParams.text}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fishtext__footer">
                    <button onClick={this.onClickButton.bind(this, textParams.text)}
                            className="fishtext__footer-button">
                        <span className="fishtext__footer-button-text" >Скопировать</span>
                    </button>
                </div>
            </div>
        }
    });
};