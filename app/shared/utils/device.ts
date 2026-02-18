/**
 * 设备检测工具函数
 * 用于判断当前设备类型（移动端/桌面端）
 */

/**
 * 判断是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 检测用户代理字符串
  const userAgent = navigator.userAgent;
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // 检测触摸支持
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 检测屏幕宽度（辅助判断，降低阈值以包含更多平板设备）
  const screenWidth = window.innerWidth;
  const isSmallScreen = screenWidth < 1024;

  // 如果检测到触摸设备且屏幕较小，优先判断为移动端
  return mobile || (touchSupport && isSmallScreen);
};

/**
 * 判断是否为平板设备
 * @returns {boolean} 是否为平板设备
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent;
  const tablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);

  return tablet;
};

/**
 * 获取设备类型
 * @returns {string} 设备类型：'mobile' | 'tablet' | 'desktop'
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobileDevice()) {
    return isTabletDevice() ? 'tablet' : 'mobile';
  }
  return 'desktop';
};

/**
 * 检测是否支持触摸事件
 * @returns {boolean} 是否支持触摸
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * 获取视口信息
 * @returns {object} 视口信息对象
 */
export const getViewportInfo = () => {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      isPortrait: true,
      isLandscape: false,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth > window.innerHeight,
  };
};