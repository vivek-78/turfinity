import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DataTable } from "./index";

import type { ColumnDef } from "@tanstack/react-table";

type TestData = {
  id: number;
  name: string;
  age: number;
};

const columns: ColumnDef<TestData, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: (info) => info.getValue()
  }
];

const data: TestData[] = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 }
];

describe("DataTable", () => {
  it("renders correctly with data", () => {
    render(<DataTable columns={columns} data={data} />);

    // Check that the table and headers are rendered
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();

    // Check that the data is rendered
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it('renders "No results" when there is no data', () => {
    render(<DataTable columns={columns} data={[]} />);

    // Check that the "No results" message is rendered
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("renders correctly with custom column headers", () => {
    const customColumns: ColumnDef<TestData, unknown>[] = [
      {
        accessorKey: "name",
        header: "Custom Name",
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "age",
        header: "Custom Age",
        cell: (info) => info.getValue()
      }
    ];
    render(<DataTable columns={customColumns} data={data} />);

    // Check that the custom headers are rendered
    expect(screen.getByText("Custom Name")).toBeInTheDocument();
    expect(screen.getByText("Custom Age")).toBeInTheDocument();
  });
});
