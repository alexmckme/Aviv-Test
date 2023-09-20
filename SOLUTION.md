# AVIV technical test solution

## Notes

Understanding the core functional expectations of the technical test was quite straightforward:
In addition to creating the GET endpoint on the `/listings/{id}/prices` route itself in the **getListingPrices** function, it was also necessary to add implementations in the **addListing** function so that a POST request on the `/listings` route would store the price in a new table, and in the **updateListing** function so that a PUT request on the `/listings/{id}` route would store the updated price in the table if the price was changed.

Most of my time was initially spent on getting acquainted with the structure of the project, understanding how different methods were used accross the various files, and testing the API with Postman.

My code was written in a way that mimicks the style of existing files: mainly similarly structured methods, intermediate functions, and naming conventions.

In addition to creating the new `prices` table by initializing it in the `/db` folder, I also inserted initial data into it, in a way that was consistent with the initial data of the 11 listings that were inserted into the `listing` table.

## Questions

- **What is missing with your implementation to go to production?** → Despite the core functionality being there, a few things are missing:
  - Updating `listingapi.yaml`, Postman collection, and more generally improving existing documentation
  - Adding unit tests to make sure the new endpoint behaves as expected (with Jest, for example)
  - Improving error handling with try / catch
  - Ensuring security for all endpoints by implementing proper authentication mechanisms
  
- **How would you deploy your implementation?**
  - I would leverage CI/CD tools to automate the testing and deployment process
  - If a migration or schema change was to be required, I would make a backup of the current database incase there are issues


- **If you had to implement the same application from scratch, what would you do differently?**

- **The application aims at storing hundreds of thousands listings and millions of prices, and be accessed by millions
  of users every month. What should be anticipated and done to handle it?** → At this point, we would need to think about scalability and reliability of the services. Thus:

  - Performance monitoring will be necessary to detect any issues
  - We will have to preventively audit for potential vulnerabilities (SQL injection, outdated packages...)
  - If the API is used by several services, we have to make sure data quality is consistent and clean over time
  - We can try to make the code and queries more efficient to improve speed, which will also benefit our end users
