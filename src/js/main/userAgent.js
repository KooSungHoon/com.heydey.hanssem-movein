import MobileDetect from 'mobile-detect/mobile-detect.min';
const mobileDetect = new MobileDetect(window && window.navigator && window.navigator.userAgent);

export const userAgent = {
    isMobile: !!mobileDetect.mobile()
};