import { Widget } from "@/components/cards/widget";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Widget
        title="Total Revenue"
        value="$1,250.00"
        description="Total Revenue"
        trend={{ value: "+12.5%", isPositive: true }}
        footerText="Trending up this month"
        footerDescription="Visitors for the last 6 months"
      />
      <Widget
        title="New Customers"
        value="1,234"
        description="New Customers"
        trend={{ value: "-20%", isPositive: false }}
        footerText="Down 20% this period"
        footerDescription="Acquisition needs attention"
      />
      <Widget
        title="Active Accounts"
        value="45,678"
        description="Active Accounts"
        trend={{ value: "+12.5%", isPositive: true }}
        footerText="Strong user retention"
        footerDescription="Engagement exceed targets"
      />
      <Widget
        title="Growth Rate"
        value="4.5%"
        description="Growth Rate"
        trend={{ value: "+4.5%", isPositive: true }}
        footerText="Steady performance increase"
        footerDescription="Meets growth projections"
      />
    </div>
  );
}
