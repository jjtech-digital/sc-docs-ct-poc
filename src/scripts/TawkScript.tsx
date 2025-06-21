import React from 'react'
import Script from "next/script";

const TawkScript = () => {
    return (
        <Script id="tawkto-chat" strategy="afterInteractive">
            {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/685539d433b4bd190b81f5f8/1iu6ejq53';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
 
            let firstIframeInterval = null;
            let secondIframeInterval = null;

            function customizeFirstIframe() {
                const chatContainer = document.querySelector('.widget-visible');
                if (!chatContainer) return;

                const iframe = chatContainer.querySelectorAll('iframe')[0];
                if (!iframe) return;

                const styles = {
                    position: 'fixed',
                    top: '10',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    'z-index': '9999'
                };

                for (const [property, value] of Object.entries(styles)) {
                    iframe.style.setProperty(property, value);
                }
            }

            function customizeSecondIframe() {
                const chatContainer = document.querySelector('.widget-visible');
                if (!chatContainer) return;

                const iframe = chatContainer.querySelectorAll('iframe')[1];
                if (!iframe) return;

                iframe.removeAttribute('style');
            }

            function startFirstIframeInterval() {
                clearInterval(secondIframeInterval);
                secondIframeInterval = null;

                if (firstIframeInterval) return;

                firstIframeInterval = setInterval(() => {
                    customizeFirstIframe();
                }, 250);
            }


            function startSecondIframeInterval() {
                clearInterval(firstIframeInterval);
                firstIframeInterval = null;

                if (secondIframeInterval) return;

                secondIframeInterval = setInterval(() => {
                    customizeSecondIframe();
                }, 300);
            }

            function stopSecondIframeInterval() {
                clearInterval(secondIframeInterval);
                secondIframeInterval = null;
            }

            // Tawk API bindings
            window.Tawk_API = window.Tawk_API || {};

            window.Tawk_API.onBeforeLoad = startFirstIframeInterval;
            window.Tawk_API.onLoad = startFirstIframeInterval;


            window.Tawk_API.onChatMaximized = startSecondIframeInterval;
            window.Tawk_API.onChatMinimized = function () {
                stopSecondIframeInterval();
                startFirstIframeInterval();
            };
            `}
        </Script>
    )
}

export default TawkScript