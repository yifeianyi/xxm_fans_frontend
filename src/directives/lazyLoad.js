// src/directives/lazyLoad.js
export default {
  mounted(el, binding) {
    // 设置默认的加载中占位图
    el.src = binding.value.placeholder || '/images/loading-placeholder.svg';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = binding.value.src || binding.value;
          
          // 创建新的图片对象预加载
          const newImg = new Image();
          newImg.onload = () => {
            img.src = src;
            img.classList.add('lazy-loaded');
          };
          newImg.onerror = () => {
            // 加载失败时显示默认图片
            img.src = binding.value.error || '/images/error-placeholder.svg';
            img.classList.add('lazy-error');
          };
          newImg.src = src;
          
          // 加载完成后停止观察
          observer.unobserve(img);
        }
      });
    }, {
      // 可选配置：提前100px开始加载
      rootMargin: '100px'
    });
    
    observer.observe(el);
  }
}