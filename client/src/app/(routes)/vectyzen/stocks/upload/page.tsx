"use client";

import FadeIn from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, FileImage, MoreHorizontal, Search } from "lucide-react";

const UploadListPage = () => {
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Uploads</h1>
          <p className="text-muted-foreground">Manage your uploaded assets.</p>
        </div>
        <Button>Upload New</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uploaded Assets</CardTitle>
              <CardDescription>
                A list of all assets you have uploaded to Vectyz.
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search uploads..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Downloads</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-12 w-16 bg-muted rounded overflow-hidden relative">
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${
                          i % 2 === 0
                            ? "from-blue-100 to-blue-200"
                            : "from-green-100 to-green-200"
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileImage className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    Abstract Design {i + 1}
                  </TableCell>
                  <TableCell>Vector</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Published
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <Download className="h-3 w-3 text-muted-foreground" /> 124
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" /> 843
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    Jan {10 + i}, 2024
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default UploadListPage;
