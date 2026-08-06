# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mockEvents.spec.js >> api mock test
- Location: tests\mockEvents.spec.js:5:1

# Error details

```
Error: locator.getAttribute: Target page, context or browser has been closed
Call log:
  - waiting for locator('article').filter({ hasText: 'Tech Innovators Conference 2026' }).locator('#book-now-btn')

```

# Test source

```ts
  43  | 
  44  | 
  45  | if (search) {
  46  |     const searchWords = search
  47  |       .toLowerCase()
  48  |       .split(" ");
  49  | 
  50  |  filteredEvents = filteredEvents.filter(event => {
  51  | 
  52  |     const eventText = Object.values(event)
  53  |         .join(" ")
  54  |         .toLowerCase();
  55  | 
  56  |     return searchWords.every(word =>
  57  |         eventText.includes(word)
  58  |     );
  59  | 
  60  |  });
  61  |     
  62  | }
  63  | 
  64  | 
  65  | if (category) {
  66  |     filteredEvents =  filteredEvents.filter(event =>
  67  |         event.category === category
  68  |     );
  69  | }
  70  | 
  71  | 
  72  | if (city) {
  73  |     filteredEvents = filteredEvents.filter(event =>
  74  |         event.city === city
  75  |     );
  76  | }
  77  |       await route.fulfill({
  78  |          response,
  79  |          
  80  |         body:JSON.stringify({
  81  |           ...mockData,
  82  |           data:filteredEvents})
  83  |      });
  84  |     }
  85  |   );
  86  |      
  87  |   //operations after mocked events   
  88  |   await loginpage.openLoginPage(page);
  89  |   await loginpage.login1(page); 
  90  |  await page.goto("/events");
  91  |      await page.waitForResponse("**/api/events**")
  92  |      await expect(page.locator(".text-3xl")).toHaveText("Upcoming Events");
  93  |      const allEvents = await loginpage.getEventCards(page);
  94  | 
  95  |   await expect(allEvents.first()).toBeVisible();
  96  |    const eventCount = await allEvents.count();
  97  |   await expect(eventCount).toBe(4);
  98  |   for(let i=0;i<4;i++){
  99  | 
  100 |     await expect(allEvents.nth(i)).toBeVisible();
  101 |     // await page.pause();
  102 |   }
  103 |   await expect(allEvents).not.toContainText(["World Tech Summit"])
  104 |   for (let i=0;i<mockData.data.length;i++)
  105 |   {
  106 | await expect(allEvents.nth(i).locator("a[href^='/events/'] h3")).toContainText(mockData.data[i].title);
  107 | await expect(allEvents.nth(i).locator(".pt-3 span")).toContainText(mockData.data[i].availableSeats.toString());//convert number to string
  108 | await expect(allEvents.nth(i).locator(".pt-3 p")).toContainText(`$${Number(mockData.data[i].price).toLocaleString()}`);
  109 | await expect(allEvents.nth(i).locator("#book-now-btn")).toHaveAttribute("href",`/events/${mockData.data[i].id}`);
  110 | 
  111 |   }
  112 | 
  113 |    await expect(page.locator(".text-3xl")).toHaveText("Upcoming Events");
  114 |   await page.getByPlaceholder("Search events, venues…").fill("Hyderabad conference");
  115 |   await page.locator("select").first().selectOption("Conference");
  116 |   await page.locator("select").last().selectOption("Hyderabad");
  117 |   await expect(allEvents.first()).toBeVisible();
  118 |    const selectedEvent = allEvents.filter({
  119 |     hasText: "Tech Innovators Conference 2026"
  120 |   });
  121 |   console.log(selectedEvent.textContent());
  122 |  const eventTitle = await selectedEvent.locator("a[href^='/events/'] h3").textContent();
  123 |  const eventPrice=await selectedEvent.locator(".pt-3 p").textContent();
  124 |  const eventAvailableSeats= parseInt(await selectedEvent.locator(".pt-3 span").textContent()).toString();
  125 |  //await page.pause();
  126 |  const bookNowLink= selectedEvent.locator("#book-now-btn");
  127 |  await  bookNowLink.click();
  128 | 
  129 |   //console.log(await page.url());
  130 |   await expect(page).toHaveURL(/events/);
  131 |  await page.waitForURL("**/events**");
  132 | 
  133 |   await expect(page.locator("h1")).toHaveText( eventTitle);
  134 | 
  135 |    const eventGrids = page.locator(".grid .mb-6 div div");
  136 |   const priceOfTickets = await eventGrids.nth(5).textContent();
  137 |   //console.log(priceOfTickets);
  138 |   await expect(priceOfTickets).toContain(eventPrice);
  139 |   await expect (await eventGrids.nth(4).locator("span").textContent()).toContain(eventAvailableSeats);
  140 | 
  141 | const bookNow = selectedEvent.locator("#book-now-btn");
  142 |  await page.pause();
> 143 | const href = await bookNow.getAttribute("href");
      |                            ^ Error: locator.getAttribute: Target page, context or browser has been closed
  144 | await expect(page.url).toContain(href);
  145 |      await page.pause();
  146 |     
  147 | 
  148 | });
  149 | 
  150 | 
  151 | 
```