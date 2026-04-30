public with sharing class DataTableController {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getRecords(
        String objectName,
        String fields,
        Integer pageSize,
        Integer pageNumber,
        String searchKey,
        String sortBy,
        String sortDirection,
        String columnFiltersJson
    ) {
        Integer offsetVal = (pageNumber - 1) * pageSize;

        String baseQuery = ' FROM ' + objectName;
        List<String> conditions = new List<String>();

        // GLOBAL SEARCH
        if (String.isNotBlank(searchKey)) {
            conditions.add('Name LIKE \'%' + searchKey + '%\'');
        }

        // COLUMN FILTERS
        if (String.isNotBlank(columnFiltersJson)) {
            Map<String, String> filters =
                (Map<String, String>) JSON.deserialize(columnFiltersJson, Map<String, String>.class);

            for (String field : filters.keySet()) {
                String value = filters.get(field);
                if (String.isNotBlank(value)) {
                    conditions.add(field + ' LIKE \'%' + value + '%\'');
                }
            }
        }

        if (!conditions.isEmpty()) {
            baseQuery += ' WHERE ' + String.join(conditions, ' AND ');
        }

        String orderBy = '';
        if (String.isNotBlank(sortBy)) {
            orderBy = ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }

        String query = 'SELECT ' + fields + baseQuery +
                       orderBy + ' LIMIT :pageSize OFFSET :offsetVal';

        List<SObject> records = Database.query(query);
        Integer total = Database.countQuery('SELECT COUNT() ' + baseQuery);

        return new Map<String, Object>{
            'records' => records,
            'totalCount' => total
        };
    }

    @AuraEnabled
    public static String getCSV(String objectName, String fields) {
        String query = 'SELECT ' + fields + ' FROM ' + objectName + ' LIMIT 500';
        List<SObject> records = Database.query(query);

        List<String> fieldList = fields.split(',');
        String csv = String.join(fieldList, ',') + '\n';

        for (SObject rec : records) {
            List<String> row = new List<String>();
            for (String f : fieldList) {
                row.add(String.valueOf(rec.get(f.trim())));
            }
            csv += String.join(row, ',') + '\n';
        }

        return csv;
    }
}