// import React from "react";
// import Nav from "../../Component/Nav";

// function Home() {
//   return (
//     <div>
//       <Nav/>
//       <h1>Home</h1>
//     </div>
//   );
// }
 
// export default Home;

import React, { useState, useEffect } from 'react';
import { Bell, ShoppingCart, Package, BarChart2, Calendar } from 'lucide-react';
import Nav from '../../Component/Nav';

const HomePage = () => {
  // Animation states
  const [barWidths, setBarWidths] = useState([0, 0, 0, 0, 0]);
  const [pieAngles, setPieAngles] = useState([0, 0, 0, 0]);
  const [categoryWidths, setCategoryWidths] = useState([0, 0, 0, 0]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Final values for bar chart
  const finalBarHeights = [60, 80, 72, 100, 72];
  const finalBarY = [100, 80, 88, 60, 88];
  
  // Final values for category chart
  const finalCategoryWidths = [300, 220, 180, 120];

  useEffect(() => {
    // Set loaded after a small delay to ensure component is mounted
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Animate bar chart
    if (isLoaded) {
      const barTimer = setTimeout(() => {
        setBarWidths(finalBarHeights);
      }, 300);
      
      // Animate pie chart
      let currentAngle = 0;
      const pieTimer = setTimeout(() => {
        setPieAngles([90, 180, 270, 360]);
      }, 800);
      
      // Animate category chart
      const categoryTimer = setTimeout(() => {
        setCategoryWidths(finalCategoryWidths);
      }, 1300);
      
      return () => {
        clearTimeout(barTimer);
        clearTimeout(pieTimer);
        clearTimeout(categoryTimer);
      };
    }
    
    return () => clearTimeout(loadTimer);
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav/>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">HomeStock</h1>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <Bell className="h-6 w-6 text-gray-500 hover:text-blue-600 cursor-pointer" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              JS
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Current Inventory</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">18 items</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Shopping List</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">3 items</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Expiring Soon</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">2 items</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">This Week's Usage</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">12 items</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Elements - Diagrams and Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Trend</h3>
            </div>
            <div className="p-4 h-64 flex items-center justify-center">
              {/* SVG Bar Chart for Inventory Trend with Animation */}
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                <text x="200" y="20" textAnchor="middle" className="text-sm font-medium">Monthly Inventory Count</text>
                
                {/* X and Y Axes */}
                <line x1="50" y1="160" x2="350" y2="160" stroke="#CBD5E0" strokeWidth="2" />
                <line x1="50" y1="40" x2="50" y2="160" stroke="#CBD5E0" strokeWidth="2" />
                
                {/* Y-axis labels */}
                <text x="40" y="160" textAnchor="end" className="text-xs">0</text>
                <text x="40" y="120" textAnchor="end" className="text-xs">10</text>
                <text x="40" y="80" textAnchor="end" className="text-xs">20</text>
                <text x="40" y="40" textAnchor="end" className="text-xs">30</text>
                
                {/* Animated Bars */}
                <rect x="70" y={160 - (barWidths[0] || 0)} width="30" height={barWidths[0] || 0} fill="#3182CE">
                  <animate 
                    attributeName="height" 
                    from="0" 
                    to="60" 
                    dur="1s" 
                    begin="0.3s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                  <animate 
                    attributeName="y" 
                    from="160" 
                    to="100" 
                    dur="1s" 
                    begin="0.3s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                </rect>
                
                <rect x="130" y={160 - (barWidths[1] || 0)} width="30" height={barWidths[1] || 0} fill="#3182CE">
                  <animate 
                    attributeName="height" 
                    from="0" 
                    to="80" 
                    dur="1s" 
                    begin="0.4s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                  <animate 
                    attributeName="y" 
                    from="160" 
                    to="80" 
                    dur="1s" 
                    begin="0.4s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                </rect>
                
                <rect x="190" y={160 - (barWidths[2] || 0)} width="30" height={barWidths[2] || 0} fill="#3182CE">
                  <animate 
                    attributeName="height" 
                    from="0" 
                    to="72" 
                    dur="1s" 
                    begin="0.5s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                  <animate 
                    attributeName="y" 
                    from="160" 
                    to="88" 
                    dur="1s" 
                    begin="0.5s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                </rect>
                
                <rect x="250" y={160 - (barWidths[3] || 0)} width="30" height={barWidths[3] || 0} fill="#3182CE">
                  <animate 
                    attributeName="height" 
                    from="0" 
                    to="100" 
                    dur="1s" 
                    begin="0.6s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                  <animate 
                    attributeName="y" 
                    from="160" 
                    to="60" 
                    dur="1s" 
                    begin="0.6s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                </rect>
                
                <rect x="310" y={160 - (barWidths[4] || 0)} width="30" height={barWidths[4] || 0} fill="#3182CE">
                  <animate 
                    attributeName="height" 
                    from="0" 
                    to="72" 
                    dur="1s" 
                    begin="0.7s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                  <animate 
                    attributeName="y" 
                    from="160" 
                    to="88" 
                    dur="1s" 
                    begin="0.7s" 
                    fill="freeze" 
                    calcMode="spline"
                    keySplines="0.215, 0.61, 0.355, 1"
                  />
                </rect>
                
                {/* X-axis labels */}
                <text x="85" y="175" textAnchor="middle" className="text-xs">Jan</text>
                <text x="145" y="175" textAnchor="middle" className="text-xs">Feb</text>
                <text x="205" y="175" textAnchor="middle" className="text-xs">Mar</text>
                <text x="265" y="175" textAnchor="middle" className="text-xs">Apr</text>
                <text x="325" y="175" textAnchor="middle" className="text-xs">May</text>
              </svg>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Expiry Timeline</h3>
            </div>
            <div className="p-4 h-64 flex items-center justify-center">
              {/* SVG Pie Chart for Expiry Timeline with Animation */}
              <svg width="100%" height="100%" viewBox="0 0 300 200">
                <text x="150" y="20" textAnchor="middle" className="text-sm font-medium">Item Expiry Distribution</text>
                
                {/* Pie Chart with Animation */}
                <circle cx="100" cy="100" r="60" fill="transparent" stroke="#E2E8F0" strokeWidth="1" />
                
                {/* Animated Pie Slices */}
                <path d="M 100 100 L 100 40 A 60 60 0 0 1 154 130 Z" fill="#FC8181" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.8s" fill="freeze" />
                </path>
                
                <path d="M 100 100 L 154 130 A 60 60 0 0 1 100 160 Z" fill="#F6AD55" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="1s" fill="freeze" />
                </path>
                
                <path d="M 100 100 L 100 160 A 60 60 0 0 1 46 130 Z" fill="#F6E05E" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="1.2s" fill="freeze" />
                </path>
                
                <path d="M 100 100 L 46 130 A 60 60 0 0 1 100 40 Z" fill="#68D391" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="1.4s" fill="freeze" />
                </path>
                
                {/* Legend */}
                <rect x="180" y="60" width="12" height="12" fill="#FC8181" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.6s" fill="freeze" />
                </rect>
                <text x="200" y="70" className="text-xs" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.6s" fill="freeze" />
                  This Week (2)
                </text>
                
                <rect x="180" y="90" width="12" height="12" fill="#F6AD55" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.7s" fill="freeze" />
                </rect>
                <text x="200" y="100" className="text-xs" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.7s" fill="freeze" />
                  Next Week (4)
                </text>
                
                <rect x="180" y="120" width="12" height="12" fill="#F6E05E" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.8s" fill="freeze" />
                </rect>
                <text x="200" y="130" className="text-xs" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.8s" fill="freeze" />
                  Two Weeks (6)
                </text>
                
                <rect x="180" y="150" width="12" height="12" fill="#68D391" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.9s" fill="freeze" />
                </rect>
                <text x="200" y="160" className="text-xs" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.9s" fill="freeze" />
                  Later (6)
                </text>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Category Distribution with Animation */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory by Category</h3>
          </div>
          <div className="p-4 flex justify-center">
            {/* SVG Horizontal Bar Chart with Animation */}
            <svg width="100%" height="200" viewBox="0 0 600 200">
              {/* X and Y Axes */}
              <line x1="150" y1="170" x2="550" y2="170" stroke="#CBD5E0" strokeWidth="2" />
              <line x1="150" y1="30" x2="150" y2="170" stroke="#CBD5E0" strokeWidth="2" />
              
              {/* Animated Bars */}
              <rect x="150" y="40" width="0" height="20" fill="#4299E1">
                <animate attributeName="width" from="0" to="300" dur="1s" begin="1.3s" fill="freeze" calcMode="spline" keySplines="0.215, 0.61, 0.355, 1" />
              </rect>
              
              <rect x="150" y="70" width="0" height="20" fill="#4299E1">
                <animate attributeName="width" from="0" to="220" dur="1s" begin="1.4s" fill="freeze" calcMode="spline" keySplines="0.215, 0.61, 0.355, 1" />
              </rect>
              
              <rect x="150" y="100" width="0" height="20" fill="#4299E1">
                <animate attributeName="width" from="0" to="180" dur="1s" begin="1.5s" fill="freeze" calcMode="spline" keySplines="0.215, 0.61, 0.355, 1" />
              </rect>
              
              <rect x="150" y="130" width="0" height="20" fill="#4299E1">
                <animate attributeName="width" from="0" to="120" dur="1s" begin="1.6s" fill="freeze" calcMode="spline" keySplines="0.215, 0.61, 0.355, 1" />
              </rect>
              
              {/* Y-axis labels */}
              <text x="140" y="50" textAnchor="end" className="text-xs">Dairy</text>
              <text x="140" y="80" textAnchor="end" className="text-xs">Produce</text>
              <text x="140" y="110" textAnchor="end" className="text-xs">Meat</text>
              <text x="140" y="140" textAnchor="end" className="text-xs">Pantry</text>
              
              {/* X-axis labels */}
              <text x="150" y="190" textAnchor="middle" className="text-xs">0</text>
              <text x="250" y="190" textAnchor="middle" className="text-xs">5</text>
              <text x="350" y="190" textAnchor="middle" className="text-xs">10</text>
              <text x="450" y="190" textAnchor="middle" className="text-xs">15</text>
              
              {/* Value labels - with animation */}
              <text x="455" y="55" textAnchor="start" className="text-xs font-medium" opacity="0">
                <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.3s" fill="freeze" />
                6 items
              </text>
              
              <text x="375" y="85" textAnchor="start" className="text-xs font-medium" opacity="0">
                <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.4s" fill="freeze" />
                4 items
              </text>
              
              <text x="335" y="115" textAnchor="start" className="text-xs font-medium" opacity="0">
                <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.5s" fill="freeze" />
                3 items
              </text>
              
              <text x="275" y="145" textAnchor="start" className="text-xs font-medium" opacity="0">
                <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.6s" fill="freeze" />
                2 items
              </text>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;