import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { campaignPerformanceData } from "@/lib/mock-data";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

export function CampaignPerformanceTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Детальная эффективность кампаний</CardTitle>
        <CardDescription>
          Сводная таблица по кампаниям с ключевыми финансовыми и вовлеченческими метриками.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Кампания</TableHead>
              <TableHead>Сегмент</TableHead>
              <TableHead className="text-right">Отправлено</TableHead>
              <TableHead className="text-right">Open Rate</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">CR</TableHead>
              <TableHead className="text-right">Доход (€)</TableHead>
              <TableHead className="text-right">Детали</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaignPerformanceData.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.campaignName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{campaign.segment}</Badge>
                </TableCell>
                <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                <TableCell className="text-right">{campaign.openRate}</TableCell>
                <TableCell className="text-right">{campaign.ctr}</TableCell>
                <TableCell className="text-right text-success font-semibold">{campaign.cr}</TableCell>
                <TableCell className="text-right font-semibold">{campaign.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
