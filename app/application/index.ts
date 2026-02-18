/**
 * Application 层统一导出
 * 
 * @module application
 * @description 导出所有用例（UseCases）
 * 
 * Application 层职责：
 * - 编排业务逻辑
 * - 协调多个 Repository
 * - 实现缓存、权限等业务规则
 * - 不直接处理 HTTP 或 UI 相关逻辑
 */

// Songs 模块
export * from './songs';

// Gallery 模块
export * from './gallery';
