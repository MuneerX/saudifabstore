"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  RefreshCw
} from "lucide-react";
import styles from "./page.module.css";
import { useAdminStats, useRecentOrders, useRevenueData } from "@/lib/hooks/useAdminData";
import { usePopularProducts } from "@/lib/hooks/usePopularProducts";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("monthly");
  const isMobile = useIsMobile();

  // Fetch real data from database
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  // Define the type for order items
  interface OrderItem {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: string;
  }
  const { orders: recentOrders, loading: ordersLoading, error: ordersError } = useRecentOrders() as {
    orders: OrderItem[];
    loading: boolean;
    error: string | null;
  };
  // Define the type for popular product items
  interface PopularProductItem {
    id: string;
    name: string;
    sales: number;
    revenue: string; // revenue is formatted to fixed 2 decimal places
    images?: string[];
    price?: number;
    discountPrice?: number;
    rating?: number;
  }

  const { products: popularProducts, loading: productsLoading, error: productsError } = usePopularProducts() as {
    products: PopularProductItem[];
    loading: boolean;
    error: string | null;
  };
  // Define the type for revenue data items
  interface RevenueDataItem {
    month: string;
    revenue: number;
  }
  
  const { data: revenueData, loading: revenueLoading, error: revenueError } = useRevenueData() as {
    data: RevenueDataItem[];
    loading: boolean;
    error: string | null;
  };

  // Create stats data from real data
  const statsData = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      description: `+${stats.revenueChange}% from last month`,
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Orders",
      value: stats.totalOrders.toString(),
      description: `+${stats.ordersChange}% from last month`,
      icon: ShoppingCart,
      trend: "up"
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      description: `+${stats.productsChange}% from last month`,
      icon: Package,
      trend: "up"
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      description: `+${stats.customersChange} since last hour`,
      icon: Users,
      trend: "up"
    },
  ];

  // Function to render a simple bar chart
  const renderBarChart = () => {
    if (revenueLoading) {
      return (
        <div className={styles.chartContainer}>
          <div className={styles.loadingChart}>
            <RefreshCw className={styles.loadingIcon} />
            <span>Loading revenue data...</span>
          </div>
        </div>
      );
    }

    if (revenueError) {
      return (
        <div className={styles.chartContainer}>
          <div className={styles.errorChart}>
            <span>Failed to load revenue data</span>
            <Button onClick={() => window.location.reload()} size="sm" variant="outline">
              Retry
            </Button>
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...revenueData.map(item => item.revenue));

    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Revenue Overview</h3>
          <div className={styles.timeRangeSelector} role="group" aria-label="Select time range">
            <Button
              variant={timeRange === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("weekly")}
              aria-pressed={timeRange === "weekly"}
            >
              Weekly
            </Button>
            <Button
              variant={timeRange === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("monthly")}
              aria-pressed={timeRange === "monthly"}
            >
              Monthly
            </Button>
            <Button
              variant={timeRange === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("yearly")}
              aria-pressed={timeRange === "yearly"}
            >
              Yearly
            </Button>
          </div>
        </div>
        <div
          className={styles.barChart}
          role="img"
          aria-label="Bar chart showing revenue by month"
        >
          {revenueData.map((item, index) => (
            <div key={index} className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{ height: `${(item.revenue / maxValue) * 100}%` }}
                aria-label={`${item.month}: $${item.revenue}`}
              />
              <span className={styles.barLabel}>{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to render a simple pie chart (keeping mock data for now as we don't have real traffic data)
  const renderPieChart = () => {
    // Mock data for traffic sources
    const trafficSources = [
      { source: "Direct", visitors: 4500, percentage: 45 },
      { source: "Social", visitors: 2500, percentage: 25 },
      { source: "Referral", visitors: 2000, percentage: 20 },
      { source: "Organic", visitors: 1000, percentage: 10 },
    ];

    // Calculate cumulative percentages for conic gradient
    let cumulativePercentage = 0;
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444']; // Blue, Green, Yellow, Red

    const conicGradientStops = trafficSources.map((source, index) => {
      const start = cumulativePercentage;
      cumulativePercentage += source.percentage;
      return `${colors[index]} ${start}% ${cumulativePercentage}%`;
    }).join(', ');

    return (
      <div className={styles.pieChartContainer}>
        <h3 className={styles.chartTitle}>Traffic Sources</h3>
        <div
          className={styles.pieChart}
          role="img"
          aria-label="Pie chart showing traffic sources"
          style={{
            background: `conic-gradient(${conicGradientStops})`
          }}
        >
          <div className={styles.pieChartCenter}>
            <span className={styles.pieChartTotal}>10K</span>
            <span className={styles.pieChartLabel}>Total Visitors</span>
          </div>
        </div>
        <div className={styles.pieChartLegend}>
          {trafficSources.map((source, index) => (
            <div key={index} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: colors[index] }}
                aria-hidden="true"
              />
              <span className={styles.legendLabel}>{source.source}</span>
              <span className={styles.legendValue}>{source.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        {!isMobile && <h1 className={styles.title}>Dashboard</h1>}
        <div className={styles.headerActions}>
          <Button
            variant="default"
            size="sm"
            className={styles.refreshButton}
            onClick={() => {
              refetchStats();
              window.location.reload();
            }}
          >
            <RefreshCw className={styles.buttonIcon} />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            className={styles.addProductButton}
            onClick={() => window.location.href = '/admin/products/add'}
          >
            <Plus className={styles.buttonIcon} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statsLoading ? (
          // Loading skeleton for stats
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <div className={styles.statIconWrapper} aria-hidden="true">
                  <div className={styles.loadingIcon} />
                </div>
                <CardTitle className={styles.statCardTitle}>
                  <div className={styles.loadingText} />
                </CardTitle>
              </CardHeader>
              <CardContent className={styles.statCardContent}>
                <div className={styles.statValue}>
                  <div className={styles.loadingText} />
                </div>
                <div className={styles.statDescription}>
                  <div className={styles.loadingText} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : statsError ? (
          <div className={styles.errorContainer}>
            <p>Failed to load dashboard statistics</p>
            <Button onClick={refetchStats} size="sm" variant="outline">
              Retry
            </Button>
          </div>
        ) : (
          statsData.map((stat, index) => (
            <Card key={index} className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <div className={styles.statIconWrapper} aria-hidden="true">
                  <stat.icon className={styles.statIcon} />
                </div>
                <CardTitle className={styles.statCardTitle}>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent className={styles.statCardContent}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statDescription}>
                  {stat.trend === "up" ? (
                    <TrendingUp className={styles.trendUp} aria-hidden="true" />
                  ) : (
                    <TrendingDown className={styles.trendDown} aria-hidden="true" />
                  )}
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <CardContent className={styles.cardContent}>
            {renderBarChart()}
          </CardContent>
        </Card>
        
        <Card className={styles.chartCard}>
          <CardContent className={styles.cardContent}>
            {renderPieChart()}
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className={styles.contentGrid}>
        {/* Recent Orders */}
        <Card className={styles.recentOrdersCard}>
          <CardHeader className={styles.cardHeader}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Recent Orders</h3>
              <div className={styles.timeRangeSelector} role="group" aria-label="View options">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/admin/orders'}
                >
                  View All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {ordersLoading ? (
              <div className={styles.loadingTable}>
                <RefreshCw className={styles.loadingIcon} />
                <span>Loading recent orders...</span>
              </div>
            ) : ordersError ? (
              <div className={styles.errorTable}>
                <span>Failed to load recent orders</span>
                <Button onClick={() => window.location.reload()} size="sm" variant="outline">
                  Retry
                </Button>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th scope="col">Order</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id.slice(-8)}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td>${order.amount}</td>
                          <td>
                            <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={`View order ${order.id}`}
                              onClick={() => window.location.href = `/admin/orders/${order.id}`}
                            >
                              <Eye className={styles.eyeIcon} aria-hidden="true" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className={styles.noData}>
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Products */}
        <Card className={styles.popularProductsCard}>
          <CardHeader className={styles.cardHeader}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Popular Products</h3>
              <div className={styles.timeRangeSelector} role="group" aria-label="View options">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/admin/products'}
                >
                  View All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {productsLoading ? (
              <div className={styles.loadingTable}>
                <RefreshCw className={styles.loadingIcon} />
                <span>Loading popular products...</span>
              </div>
            ) : productsError ? (
              <div className={styles.errorTable}>
                <span>Failed to load popular products</span>
                <Button onClick={() => window.location.reload()} size="sm" variant="outline">
                  Retry
                </Button>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.productsTable}>
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Orders</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularProducts.length > 0 ? (
                      popularProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.sales.toLocaleString()}</td>
                          <td>${product.revenue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className={styles.noData}>
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}