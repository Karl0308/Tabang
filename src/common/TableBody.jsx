import React from "react";
import _ from "lodash";
import formatNumber from "../Services/NumberFormatter";
const TableBody = ({ data, columns }) => {
  const renderCell = (item, column) => {
    if (column.content) return column.content(item);

    let cellValue = _.get(item, column.path);
    if (cellValue != null && !isNaN(cellValue) && column.path != "code") {
        cellValue = formatNumber(cellValue);
    } else if (cellValue != null && cellValue instanceof Date) {
      cellValue = cellValue
        ? new Date(cellValue).toLocaleDateString("en-PH")
        : "";
    }
    return cellValue;
  };

  const createKey = (item, column) => {
    return item.id + (column.path || column.key);
  };

  return (
    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          {columns.map((column) => (
            <td className={ !isNaN(_.get(item, column.path)) ? "textRight" : ""} key={createKey(item, column)}>{renderCell(item, column)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
