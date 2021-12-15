import React from "react";

const TablesListItem = ({ table }) => {
  const getSeated = () => {
    return table.reservation ? "Occupied" : "Free";
  };

  return (
    <div className="card p-3 mb-3">
      <div>
        <p>
          <strong>Table Name: </strong>
          {table.table_name}
        </p>
      </div>
      <div>
        <p>
          <strong>Capacity: </strong>
          {table.capacity}
        </p>
      </div>
      <div>
        <p data-table-id-status={table.table_id}>{getSeated()}</p>
      </div>
    </div>
  );
};

export default TablesListItem;