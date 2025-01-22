const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Natural Function Name", name: "nf_name", type: "text" },
    { label: "Role", name: "role", type: "select", options: ["Primary", "Alternate"] },
    { label: "Office Phone", name: "office_phone", type: "tel" },
    { label: "Cellular Phone", name: "mobile_phone", type: "tel" },
    { label: "Join Date", name: "join_date", type: "date" },
    { label: "Exit Date", name: "exit_date", type: "date" },
];

export default fields;