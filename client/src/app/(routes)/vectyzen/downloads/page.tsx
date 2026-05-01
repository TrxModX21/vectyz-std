import FadeIn from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileBox, Search } from "lucide-react";

const DownloadsPage = () => {
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Download History</h1>
          <p className="text-muted-foreground">
            Access your previously downloaded assets.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Downloads</CardTitle>
              <CardDescription>
                You can re-download these assets at any time.
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search history..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Type</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>License</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                      <FileBox className="h-5 w-5 text-primary" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    Corporate Business Flyer {i + 1}
                    <div className="text-xs text-muted-foreground">
                      ID: 483920{i}
                    </div>
                  </TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Premium
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    Feb {14 - i}, 2026
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Save
                    </Button>
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

export default DownloadsPage;
