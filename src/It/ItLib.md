# ItPhp library Utilities/helpers for php:

## Arr: Arrays
## DatesHelpers
## BCMath
## Html
### CSS
### HTML Tags
### JS
### Request
### Response
## FormatIt
## Numbers
## Sql

### Builder
    * execute-query ?  string, string/params, stored statement. requires PHP >= 8.2.0 execute-query.php
    * on update
        * alias vs Values
```SQL
	-- MySQL >= 8.0.19 and later, you can use aliases in the ON DUPLICATE KEY UPDATE
	CREATE TABLE tabla(col1 int not null PRIMARY KEY , col2 int);
	INSERT INTO tabla(col1, col2) VALUES (1,2),(3,4),(5,6);
	INSERT INTO tabla(col1, col2) VALUES (1,20),(3,40),(5,60)
	AS new_row(new_col1, new_col2)
	ON DUPLICATE KEY UPDATE col2 = new_col2;
```

### Execute

### MultiInsert
## Session
## Str: Strings

# ItJslibrary Utilities/helpers for js:
	* itFormat que tiene temas de ...

# Widgets: php + js
## Address+Map
## Checked
## Error detector
## History
## Logs
## Photo Camera Attachment
## Photo Gallery Attachment
## Photo Camera or Gallery Attachment
## Sign-In/Login ...
## Uploader
## Pluto site builder

# Form Wizard

# Pos los links
		* https://www.frontendmentor.io/
