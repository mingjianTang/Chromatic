const path = require('path');
 
module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    verbose: true,
    testURL: 'http://localhost/',
    rootDir: path.resolve(__dirname),
    moduleFileExtensions: [
      'js',
      'json',
      'vue'
    ],
    moduleNameMapper: {
      '^@\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/$1',   // @路径转换，例如：@/components/Main.vue -> rootDir/src/components/Main.vue
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/unit/__mocks__/fileMock.js', // 模拟加载静态文件
      '\\.(css|less|scss|sass)$': '<rootDir>/tests/unit/__mocks__/styleMock.js' // 模拟加载样式文件   
    },
    testMatch: [ //匹配测试用例的文件
      '<rootDir>/tests/unit/*.spec.js'
    ],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
      '^.+\\.jsx?$': 'babel-jest',
    },
    testPathIgnorePatterns: [
      '<rootDir>/tests/e2e'
    ],
    transformIgnorePatterns: ['/node_modules/'],
    setupFiles: ['<rootDir>/tests/setup.js'],
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    collectCoverage: true, // 开启生成测试报告
    coverageDirectory: '<rootDir>/tests/unit/coverage', // 覆盖率报告的目录
    collectCoverageFrom: [ // 测试报告想要覆盖那些文件，目录，前面加！是避开这些文件
      // 'src/components/**/*.(js|vue)',
      // 'src/components/*.(vue)',
      'src/**/*.(js|vue)',
      '!src/stories/*.(js|vue)',
      '!src/main.js',
      '!**/node_modules/**'
    ]
}