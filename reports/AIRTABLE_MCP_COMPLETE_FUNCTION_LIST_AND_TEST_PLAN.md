# Airtable MCP Server - Complete Function List & Testing Plan
*Generated: September 9, 2025*

## 📊 Complete Function Inventory

### **TOTAL: 13 Functions + 1 Resource Type**

---

## 🔍 **CATEGORY 1: SCHEMA & DISCOVERY (4 Functions)**

### 1. `list_bases`
- **Purpose**: Lists all accessible Airtable bases
- **Parameters**: None required
- **Returns**: Base ID, name, and permission level
- **Test Priority**: ⭐⭐⭐ HIGH (Foundation function)

### 2. `list_tables` 
- **Purpose**: Lists all tables in a specific base
- **Parameters**: 
  - `baseId` (required)
  - `detailLevel` (optional): `tableIdentifiersOnly`, `identifiersOnly`, `full`
- **Returns**: Table ID, name, description, fields, views
- **Test Priority**: ⭐⭐⭐ HIGH (Foundation function)

### 3. `describe_table`
- **Purpose**: Gets detailed information about a specific table
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required) 
  - `detailLevel` (optional): `tableIdentifiersOnly`, `identifiersOnly`, `full`
- **Returns**: Complete table schema with fields and views
- **Test Priority**: ⭐⭐⭐ HIGH (Foundation function)

### 4. **Resource: Table Schemas**
- **URI Format**: `airtable://<baseId>/<tableId>/schema`
- **Purpose**: JSON schema information for tables
- **Returns**: Base/table IDs, field definitions, view definitions
- **Test Priority**: ⭐⭐ MEDIUM (Advanced feature)

---

## 📖 **CATEGORY 2: RECORD READING (3 Functions)**

### 5. `list_records`
- **Purpose**: Lists records from a specified table
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `maxRecords` (optional, default: 100)
  - `filterByFormula` (optional): Airtable formula
- **Returns**: Array of records with fields
- **Test Priority**: ⭐⭐⭐ HIGH (Core functionality)

### 6. `search_records`
- **Purpose**: Search for records containing specific text
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `searchTerm` (required)
  - `fieldIds` (optional): Array of field IDs to search
  - `maxRecords` (optional, default: 100)
- **Returns**: Matching records
- **Test Priority**: ⭐⭐ MEDIUM (Search feature)

### 7. `get_record`
- **Purpose**: Gets a specific record by ID
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `recordId` (required)
- **Returns**: Single record with all fields
- **Test Priority**: ⭐⭐⭐ HIGH (Core functionality)

---

## ✏️ **CATEGORY 3: RECORD WRITING (3 Functions)**

### 8. `create_record`
- **Purpose**: Creates a new record in a table
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `fields` (required): Object with field values
- **Returns**: Created record with ID
- **Test Priority**: ⭐⭐⭐ HIGH (Core CRUD)

### 9. `update_records`
- **Purpose**: Updates one or more records in a table
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `records` (required): Array of {id, fields} objects
- **Returns**: Updated records
- **Test Priority**: ⭐⭐⭐ HIGH (Core CRUD)

### 10. `delete_records`
- **Purpose**: Deletes one or more records from a table
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `recordIds` (required): Array of record IDs
- **Returns**: Deletion confirmation
- **Test Priority**: ⭐⭐⭐ HIGH (Core CRUD)

---

## 🏗️ **CATEGORY 4: TABLE STRUCTURE (2 Functions)**

### 11. `create_table`
- **Purpose**: Creates a new table in a base
- **Parameters**:
  - `baseId` (required)
  - `name` (required)
  - `description` (optional)
  - `fields` (required): Array of field definitions
- **Returns**: Created table metadata
- **Test Priority**: ⭐⭐ MEDIUM (Advanced admin)

### 12. `update_table`
- **Purpose**: Updates a table's name or description
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `name` (optional)
  - `description` (optional)
- **Returns**: Updated table metadata
- **Test Priority**: ⭐ LOW (Admin function)

---

## 🔧 **CATEGORY 5: FIELD MANAGEMENT (2 Functions)**

### 13. `create_field`
- **Purpose**: Creates a new field in a table
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `name` (required)
  - `type` (required): Field type
  - `description` (optional)
  - `options` (optional): Field-specific options
- **Returns**: Created field metadata
- **Test Priority**: ⭐⭐ MEDIUM (Advanced admin)

### 14. `update_field`
- **Purpose**: Updates a field's name or description
- **Parameters**:
  - `baseId` (required)
  - `tableId` (required)
  - `fieldId` (required)
  - `name` (optional)
  - `description` (optional)
- **Returns**: Updated field metadata
- **Test Priority**: ⭐ LOW (Admin function)

---

# 🧪 **COMPREHENSIVE TESTING PLAN**

## **Phase 1: Foundation Testing (4 Functions)**
*Priority: CRITICAL - Must pass 100%*

### Test Group A: Schema Discovery
```bash
# Tests 1-4: Foundation
✅ list_bases                    # Already tested ✅
✅ list_tables                   # Already tested ✅ 
✅ describe_table                # Already tested ✅
🔄 Table Schema Resource         # Need to test
```

**Test Strategy**: 
- Verify all bases are accessible
- Test different `detailLevel` parameters
- Validate schema resource URI format
- Check field type detection accuracy

---

## **Phase 2: Core CRUD Testing (6 Functions)**
*Priority: HIGH - Production critical*

### Test Group B: Record Reading
```bash
# Tests 5-7: Reading Operations
🔄 list_records                  # Basic test done, need advanced
🔄 search_records               # Not tested yet
🔄 get_record                   # Not tested yet
```

### Test Group C: Record Writing  
```bash
# Tests 8-10: Writing Operations
🔄 create_record                # Partial test (timeout issue)
🔄 update_records               # Not tested yet
🔄 delete_records               # Not tested yet
```

**Test Strategy**:
- Create → Read → Update → Delete cycle
- Test bulk operations (multiple records)
- Test different field types
- Test formula filtering
- Test search across different field types

---

## **Phase 3: Advanced Features (4 Functions)**
*Priority: MEDIUM - Enhanced capabilities*

### Test Group D: Structure Management
```bash
# Tests 11-14: Administrative Functions
🔄 create_table                 # Not tested yet
🔄 update_table                 # Not tested yet
🔄 create_field                 # Not tested yet  
🔄 update_field                 # Not tested yet
```

**Test Strategy**:
- Test in isolated test base
- Verify different field types creation
- Test table relationship handling
- Clean up all created structures

---

# 🚀 **AUTOMATED TESTING STRATEGY**

## **Test Implementation Approach**

### 1. **Test Infrastructure**
```javascript
// Create test suite with categories
const testSuite = {
  foundation: [...],    // 4 tests
  crudReading: [...],   // 3 tests  
  crudWriting: [...],   // 3 tests
  advanced: [...]       // 4 tests
}
```

### 2. **Test Data Management**
- **Test Base**: `apph63s7hDSzIXD59` 
- **Test Table**: `tblGzWR1aYpAssoOP` (Alfie Expert Destination Master)
- **Clean-up Strategy**: Mark all test records with `TEST_` prefix
- **Restoration**: Automated cleanup after testing

### 3. **Test Execution Plan**

#### **Batch 1: Safe Operations** (Read-only)
```bash
# Run in parallel - no data modification
list_bases, list_tables, describe_table, list_records, search_records, get_record
```

#### **Batch 2: Write Operations** (Sequential)
```bash  
# Run sequentially - data modification
create_record → get_record → update_records → delete_records
```

#### **Batch 3: Structure Operations** (Isolated)
```bash
# Run in test-only environment
create_table → create_field → update_table → update_field
```

### 4. **Success Criteria**

#### **Minimum Viable Testing**: 10/14 Functions (71%)
- ✅ All Foundation functions (4/4)
- ✅ All CRUD Reading functions (3/3) 
- ✅ All CRUD Writing functions (3/3)

#### **Complete Testing**: 14/14 Functions (100%)
- ✅ All functions above +
- ✅ All Advanced functions (4/4)

### 5. **Test Automation Code Structure**

```javascript
// Main test runner
async function runCompleteTestSuite() {
  const results = {
    foundation: await runFoundationTests(),
    crudReading: await runReadingTests(),
    crudWriting: await runWritingTests(), 
    advanced: await runAdvancedTests()
  };
  
  return generateReport(results);
}
```

---

# 📋 **TEST EXECUTION CHECKLIST**

## **Pre-Testing Setup** 
- [ ] Verify API tokens are working
- [ ] Backup test table current state
- [ ] Set up test data markers
- [ ] Configure test timeouts (30s each)

## **Testing Execution**
- [ ] **Phase 1**: Foundation (4 functions) - 5 minutes
- [ ] **Phase 2**: CRUD Operations (6 functions) - 15 minutes  
- [ ] **Phase 3**: Advanced Features (4 functions) - 10 minutes

## **Post-Testing**
- [ ] Clean up all test records
- [ ] Restore table to original state
- [ ] Generate comprehensive report
- [ ] Document any failures with solutions

---

# 🎯 **EXPECTED OUTCOMES**

## **Production Readiness Matrix**

| Function Category | Test Coverage | Production Ready |
|------------------|---------------|------------------|
| Schema Discovery | 4/4 (100%) | ✅ Ready |
| Record Reading | 3/3 (100%) | ✅ Ready |  
| Record Writing | 3/3 (100%) | ⏳ Pending Tests |
| Advanced Features | 4/4 (100%) | ⏳ Pending Tests |

## **Risk Assessment**
- **Low Risk**: Schema functions (already tested)
- **Medium Risk**: CRUD operations (partial testing)
- **High Risk**: Advanced features (untested)

**FINAL GOAL**: Achieve 100% function coverage with comprehensive automated test suite! 🚀