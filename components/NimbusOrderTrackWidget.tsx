"use client"
import { useEffect } from "react";

export default function NimbusOrderTrackWidget() {
  useEffect(() => {
    // Add the NimbusPost tracking CSS
    const createOrderTrackCss = document.createElement("link");
    createOrderTrackCss.setAttribute("rel", "stylesheet");
    createOrderTrackCss.setAttribute("href", "https://ship.nimbuspost.com/assets/css/nimbus_order_track.css");
    document.body.appendChild(createOrderTrackCss);

    // Add the NimbusPost tracking JS
    const createOrderTrackScript = document.createElement("script");
    createOrderTrackScript.setAttribute("src", "https://ship.nimbuspost.com/assets/js/nimbus_order_track.js");
    createOrderTrackScript.setAttribute("subdom", "nimbuz");
    createOrderTrackScript.onload = () => {
      try {
        const trackBtn = document.getElementsByClassName('track-button-nib')[0] as HTMLElement | undefined;
        if (trackBtn) {
          trackBtn.style.background = '#000000';
          trackBtn.style.color = '#ffffff';
        }
        const orderBox = document.getElementsByClassName('order-ship-box-nib')[0] as HTMLElement | undefined;
        if (orderBox) orderBox.style.backgroundColor = '#f9fbfd';
        const orderBoxH1 = document.querySelector('.order-ship-box-nib h1') as HTMLElement | null;
        if (orderBoxH1) orderBoxH1.style.color = '#000000';
        const searchInput = document.querySelector('.search-input-wrp-nib') as HTMLElement | null;
        if (searchInput) searchInput.style.backgroundColor = '#ffffff';
        const searchBtn = document.querySelector('.search-button-wrp-nib') as HTMLElement | null;
        if (searchBtn) {
          searchBtn.style.color = '#ffffff';
          searchBtn.style.backgroundColor = '#000000';
        }
        const inputSearch = document.querySelector('#input_search') as HTMLElement | null;
        if (inputSearch) {
          inputSearch.style.setProperty('--c', '#000000');
          inputSearch.style.color = '#000000';
        }
      } catch (e) {
        // Elements may not exist yet
      }
    };
    document.body.appendChild(createOrderTrackScript);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(createOrderTrackCss);
      document.body.removeChild(createOrderTrackScript);
    };
  }, []);

  return <div id="nimbus-order-track-widget" />;
} 