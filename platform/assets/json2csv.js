/* Convert arbitrary array of JSON objects into a CSV string.
 *
 * Nested object keys are joined by . to create a column name.
 *
 * Handles arrays, objects, arrays of objects, etc.
 *
 * Copyright Mixpanel 2015
 */

var json2csv = function() {};

(function() {

    json2csv.prototype.jsonToTable = function(json) {
        var rows = [];
        var columns = {};
        if (!(_.isArray(json))) {
            throw new TypeError("must pass in a javascript array");
        }
        // [[a, b, c]] array of 1 array is stupid as 1 row,
        // use multiple for this edge case.
        if (json.length === 1 && _.isArray(json[0])) {
            json = json[0];
        }
        _.each(json, function(doc) {
            // if the document is not an obj or array,
            // we need to make it one (so that we have a column)
            if (!(_.isArray(doc) || _.isObject(doc))) {
                doc = {
                    value: doc
                };
            }
            var d = _flatten(doc);
            _.keys(d).map(function(k) {
                columns[k] = 1
            });
            rows.push(d);
        });
        columns = _sortColumns(_.keys(columns));
        return _formatTable(columns, rows);
    }

    json2csv.prototype.jsonToCSV = function(json) {
        var csv = "";
        _.each(this.jsonToTable(json), function(row) {
            csv += row.join(",") + "\n";
        });
        return csv;
    }

    var _formatType = function(item) {
        if (_.isNumber(item) ||
            _.isString(item) ||
            _.isBoolean(item)) {
            return item;
        } else if (_.isNull(item)) {
            return "null";
        } else if (_.isUndefined(item)) {
            return "undefined";
        } else if (_.isNaN(item)) {
            return "NaN";
        } else {
            throw new TypeError("unknown type: ", item);
        }
    }

    var _flatten = function(item) {
        // turn any object of any depth into a flattened object
        // with full key specification
        if (_.isArray(item) || _.isObject(item)) {
            var flattened = {};
            _.each(item, function(val, key) {
                var prefix = key.toString();
                var item = _flatten(val);

                // if flattened value is an object, it was something complex.
                // prefix each of the keys with our current array index and return;
                if (_.isObject(item)) {
                    _.each(item, function(val, key) {
                        flattened[prefix + "." + key] = val;
                    });
                } else {
                    flattened[prefix] = item;
                }
            });
            return flattened;
        } else {
            return _formatType(item);
        }
    }

    var _sortColumns = function(keys) {
        // sort the set of all columns in a smart way (handles nested numeric keys,
        // which would otherwise be sorted lexigraphically)
        var split_keys = keys.map(function(k) {
            return k.split(".")
        });
        split_keys.sort(function(a, b) {
            var i = 0;
            // find the first key level that differs, use that to sort
            while (a[i] == b[i] && i < a.length) {
                i++;
            }

            var key1 = a[i],
                key2 = b[i];

            var key1_is_numeric = !isNaN(key1),
                key2_is_numeric = !isNaN(key2);

            if (key1_is_numeric && key2_is_numeric) {
                return parseFloat(key1) - parseFloat(key2);
            } else if (key1_is_numeric && !key2_is_numeric) {
                return 1;
            } else if (key2_is_numeric && !key1_is_numeric) {
                return -1;
            } else if (key1 > key2) {
                return 1;
            } else {
                return -1;
            }
        });
        return split_keys.map(function(k) {
            return k.join(".")
        });
    }

    var _formatCell = function(cell) {
        return '"' + cell.replace('"', '""') + '"';
    }

    var _formatTable = function(columns, rows) {
        var output = [];
        output.push(columns.map(_formatCell));
        _.each(rows, function(row) {
            output.push(columns.map(function(c) {
                // wrap everything but numbers in quotes
                if (_.isNumber(row[c])) {
                    return row[c];
                } else {
                    return _formatCell(_formatType(row[c]));
                }
            }));
        });
        return output;
    }
})();
