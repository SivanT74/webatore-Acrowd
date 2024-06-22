export const dispatchCartUpdateEvent = () => {
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };
  