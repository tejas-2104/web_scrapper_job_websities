const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const fs = require('fs');

const url = 'https://www.foundit.in/search/it-jobs?searchId=38c36d4d-9e33-47a7-9fdd-f842a2b9dd67';

const getPageData = async () => {
    try {
        const response = await axios.get(url);
        const data = response.data;

        // Save HTML content to a text file
        // fs.writeFileSync('page.html', data, 'utf-8');

        const $ = cheerio.load(data);
        
        let jobData = [];

        // Extract the data you want
        $('.cardContainer').each((index, element) => {
            const jobTitle = $(element).find('h3.jobTitle').text().trim();
            const jobType = $(element).find('.addEllipsis span').text().trim();
            const location = $(element).find('.addEllipsis span.under-link').text().trim();
            const postingDate = $(element).find('.jobAddedTime p.timeText').text().trim() || "n/a";

            jobData.push({
                jobTitle,
                jobType,
                location,
                postingDate
            });
        });

        console.log(jobData);
        saveToExcel(jobData);
    } catch (err) {
        console.log(err);
    }
};

const saveToExcel = (data) => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Jobs');
    xlsx.writeFile(workbook, 'jobs.xlsx');
};

getPageData();
