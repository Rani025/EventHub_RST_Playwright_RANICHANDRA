import {defineConfig} from '@playwright/test';


export default defineConfig({
    testDir: './tests',
    retries:1,
  use: {
 
  headless: false,
    baseURL:'https://eventhub.rahulshettyacademy.com/login',

    // Base URL to use in actions like `await page.goto('/')`.
   // baseURL: 'https://eventhub.rahulshettyacademy.com/login',

    
  },
  projects:[
    {
        name:'chromium',
        use:{browserName:'chromium'}
    },
    {
        ame:'firefox',
        use:{browserName:'firefox'}

    }
  ]
});

