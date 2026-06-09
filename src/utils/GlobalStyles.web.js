import React from 'react';

export default function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      input:focus, textarea:focus, select:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    `}} />
  );
}
