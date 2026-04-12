## Usage Flow

1. Create Employees first  
   - Endpoint: POST /employees  
   - Employees are required to assign leads

2. Add Leads (Manual or CSV)  
   - Manual: POST /leads/manual  
   - CSV Upload: POST /leads/csv  

3. Assign Leads to Employees  
   - Leads can be assigned only if employees exist

4. Manage Leads  
   - Update status (ongoing / closed)  
   - Schedule follow-ups
  
    ## Important Notes

- Employees must be created before adding leads
- CSV upload requires correct format (name, email, etc.)
- Leads without employees will remain unassigned

  ## CSV Format Example leads.csv

-name,email,source,leadDate,location,language
   -John Doe,john@example.com,Facebook,2024-03-10,USA,English
    -Jane Smith,jane@example.com,Website,2024-03-12,UK,English
