'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { TooltipProps, LegendProps } from 'recharts';
import { cn } from '@/lib/utils';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<HTMLDivElement, TooltipProps<any, any> & {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
}>((props, ref) => {
  const {
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    labelFormatter,
    labelClassName,
    formatter,
    nameKey,
    labelKey,
  } = props as TooltipProps<any, any> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  };
  const payload: any[] = (props as any).payload || [];
  const label = (props as any).label;
  const className = (props as any).className;

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }
    const [item] = payload;
    const key = `${labelKey || item.dataKey || item.name || 'value'}`;
    const value = !labelKey && typeof label === 'string' ? label : item.name;
    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload) as unknown as React.ReactNode}
        </div>
      );
    }
    if (!value) {
      return null;
    }
    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, labelKey]);

  if (!props.active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      ref={ref}
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item: any) => typeof item.value !== 'bigint')
          .map((item: any, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const indicatorColor = item.payload?.fill || item.color;
            return (
              <div
                key={item.dataKey}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                      {
                        'h-2.5 w-2.5': indicator === 'dot',
                        'w-1': indicator === 'line',
                        'w-0 border-[1.5px] border-dashed bg-transparent':
                          indicator === 'dashed',
                        'my-0.5': nestLabel && indicator === 'dashed',
                      }
                    )}
                    style={{
                      '--color-bg': indicatorColor,
                      '--color-border': indicatorColor,
                    } as React.CSSProperties}
                  />
                )}
                <div
                  className={cn(
                    'flex flex-1 justify-between leading-none',
                    nestLabel ? 'items-end' : 'items-center'
                  )}
                >
                  <div className="grid gap-1.5">
                    {nestLabel ? tooltipLabel : null}
                    <span className="text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  {item.value && typeof item.value !== 'bigint' && (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {String(item.value)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
});
ChartTooltipContent.displayName = 'ChartTooltip';

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<HTMLDivElement, LegendProps & {
  hideIcon?: boolean;
  nameKey?: string;
}>((props, ref) => {
  const {
    hideIcon = false,
    verticalAlign = 'bottom',
  } = props as LegendProps & {
    hideIcon?: boolean;
    nameKey?: string;
  };
  const payload: any[] = (props as any).payload || [];
  const nameKey = (props as any).nameKey;
  const className = (props as any).className;

  if (!payload?.length) {
    return null;
  }
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload
        .filter((item: any) => typeof item.value !== 'bigint')
        .map((item: any) => (
          <div
            key={item.value}
            className={cn(
              'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
            )}
          >
            {!hideIcon ? (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            ) : null}
            {typeof item.value !== 'bigint' ? String(item.value) : null}
          </div>
        ))}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegend';

export {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
