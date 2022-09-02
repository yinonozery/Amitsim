import { useRef } from 'react';
import { MdClose, MdCheck } from 'react-icons/md';
import { animated, useTransition } from 'react-spring';
import './layout/popup.css';

const Popup = (props) => {
    const popUpRef = useRef();

    const transition = useTransition(props.showPopup, {
        from: { transform: `scale(1.5)`, opacity: 0 },
        enter: { transform: `scale(1)`, opacity: 1 },
        leave: { transform: `scale(1.5)`, opacity: 0 },
    });

    //when clicking outside the popup
    const closePopup = (e) => {
        if (popUpRef.current === e.target) {
            props.handlePopup();
        }
    };

    return (
        <div>
            {props.showPopup && (
                <div
                    className='outside-background spaced'
                    ref={popUpRef}
                    onClick={closePopup}>
                    {transition(
                        (style, item) =>
                            item && (
                                <animated.div
                                    className='popUp box container container--mini'
                                    style={style}>
                                    <div className='popUp-content container'>
                                        <h1 className='popUp-content__title'>
                                            {props.title}
                                        </h1>
                                        <p className='popUp-content__description'>
                                            {props.description}
                                        </p>
                                        {props.html}

                                        {!props.noButton ? (
                                            <button className='btn--accent' name='popupButton'>
                                                <div className='spaced'>
                                                    <p>{props.buttonText}</p>
                                                    <div className='btn__icon btn__icon--edit'>
                                                        <MdCheck />
                                                    </div>
                                                </div>
                                            </button>
                                        ) : null}
                                    </div>
                                    <MdClose
                                        className='popUp__close-btn'
                                        aria-label='Close popup'
                                        onClick={() => props.handlePopup()}
                                    />
                                </animated.div>
                            )
                    )}
                </div>
            )}
        </div>
    );
};

export default Popup;
