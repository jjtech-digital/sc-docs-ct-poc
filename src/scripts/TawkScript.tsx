// app/scripts/TawkScript.tsx
import Script from "next/script";

export default function TawkScript() {
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

      `}
        </Script>
    );
}
