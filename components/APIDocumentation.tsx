"use client";

import { useState } from "react";
import {
  Code,
  ChevronDown,
  Copy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  category: string;
  requestBody?: object;
  responseBody?: object;
  headers?: { [key: string]: string };
  queryParams?: { [key: string]: string };
  example?: {
    request?: string;
    response?: string;
  };
}

interface APIDocumentationProps {
  endpoints?: APIEndpoint[];
  baseUrl?: string;
}

const mockEndpoints: APIEndpoint[] = [
  {
    method: "GET",
    path: "/api/users",
    description: "List all users with pagination",
    category: "Users",
    queryParams: {
      page: "Page number (default: 1)",
      limit: "Items per page (default: 20)",
      status: "Filter by status (active, suspended, banned)",
    },
    responseBody: {
      users: [
        {
          id: "user_123",
          email: "user@example.com",
          status: "active",
          createdAt: "2024-01-15T10:00:00Z",
        },
      ],
      total: 1500,
      page: 1,
      limit: 20,
    },
    example: {
      request: "GET /api/users?page=1&limit=10&status=active",
      response:
        '{\n  "users": [...],\n  "total": 1500,\n  "page": 1,\n  "limit": 20\n}',
    },
  },
  {
    method: "POST",
    path: "/api/users/:id/ban",
    description: "Ban a user account",
    category: "Users",
    headers: {
      Authorization: "Bearer {admin_token}",
      "Content-Type": "application/json",
    },
    requestBody: {
      reason: "Terms of Service violation",
      duration: 30,
    },
    responseBody: {
      id: "user_123",
      status: "banned",
      bannedUntil: "2024-02-15T10:00:00Z",
      reason: "Terms of Service violation",
    },
    example: {
      request:
        'POST /api/users/user_123/ban\n{\n  "reason": "Terms violation",\n  "duration": 30\n}',
      response:
        '{\n  "id": "user_123",\n  "status": "banned",\n  "bannedUntil": "2024-02-15T10:00:00Z"\n}',
    },
  },
  {
    method: "DELETE",
    path: "/api/videos/:id",
    description: "Delete a video from the platform",
    category: "Content",
    headers: {
      Authorization: "Bearer {admin_token}",
    },
    requestBody: {
      reason: "Policy violation",
    },
    responseBody: {
      success: true,
      message: "Video deleted successfully",
      videoId: "video_456",
    },
    example: {
      request: 'DELETE /api/videos/video_456\n{\n  "reason": "Policy violation"\n}',
      response: '{\n  "success": true,\n  "videoId": "video_456"\n}',
    },
  },
  {
    method: "GET",
    path: "/api/analytics/revenue",
    description: "Get revenue analytics",
    category: "Analytics",
    queryParams: {
      startDate: "ISO 8601 date (e.g., 2024-01-01)",
      endDate: "ISO 8601 date (e.g., 2024-01-31)",
      groupBy: "daily, weekly, monthly",
    },
    responseBody: {
      total: 25430,
      currency: "USD",
      data: [
        {
          date: "2024-01-01",
          amount: 820,
          transactions: 42,
        },
      ],
    },
  },
];

export function APIDocumentation({
  endpoints = mockEndpoints,
  baseUrl = "https://api.spred.cc",
}: APIDocumentationProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "POST":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "PUT":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "PATCH":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "DELETE":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [...new Set(endpoints.map((e) => e.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Code className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">API Documentation</h3>
      </div>

      {/* Base URL */}
      <div className="glass-card rounded-xl border-white/10 p-4">
        <p className="text-xs font-bold text-zinc-600 uppercase mb-2">
          Base URL
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm font-mono text-white bg-white/5 px-3 py-2 rounded">
            {baseUrl}
          </code>
          <button
            onClick={() => copyToClipboard(baseUrl, "base-url")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          >
            {copiedId === "base-url" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4 text-zinc-500" />
            )}
          </button>
        </div>
      </div>

      {/* Endpoints by Category */}
      {categories.map((category) => {
        const categoryEndpoints = endpoints.filter(
          (e) => e.category === category
        );

        return (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase">
              {category}
            </h4>

            <div className="space-y-2">
              {categoryEndpoints.map((endpoint, idx) => {
                const endpointId = `${endpoint.method}-${endpoint.path}`;

                return (
                  <div key={idx} className="space-y-2">
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === endpointId ? null : endpointId
                        )
                      }
                      className="w-full glass-card rounded-xl border-white/10 p-4 hover:bg-white/[0.03] transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <span
                            className={cn(
                              "px-2 py-1 rounded text-[10px] font-bold uppercase border-2",
                              getMethodColor(endpoint.method)
                            )}
                          >
                            {endpoint.method}
                          </span>
                          <div className="flex-1 text-left">
                            <p className="font-mono text-sm text-white">
                              {endpoint.path}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              {endpoint.description}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-zinc-500 transition-transform flex-shrink-0",
                            expandedId === endpointId && "rotate-180"
                          )}
                        />
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {expandedId === endpointId && (
                      <div className="pl-4 space-y-2">
                        {/* Headers */}
                        {endpoint.headers && (
                          <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
                            <p className="text-xs font-bold text-zinc-600 uppercase">
                              Headers
                            </p>
                            {Object.entries(endpoint.headers).map(
                              ([key, value]) => (
                                <div key={key} className="font-mono text-xs">
                                  <p className="text-white">{key}</p>
                                  <p className="text-zinc-600">{value}</p>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Query Parameters */}
                        {endpoint.queryParams && (
                          <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
                            <p className="text-xs font-bold text-zinc-600 uppercase">
                              Query Parameters
                            </p>
                            {Object.entries(endpoint.queryParams).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <p className="text-xs font-bold text-white">
                                    {key}
                                  </p>
                                  <p className="text-[10px] text-zinc-600">
                                    {value}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Request Body */}
                        {endpoint.requestBody && (
                          <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
                            <p className="text-xs font-bold text-zinc-600 uppercase">
                              Request Body
                            </p>
                            <pre className="text-[10px] text-white bg-white/5 p-2 rounded overflow-x-auto">
                              {JSON.stringify(endpoint.requestBody, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Example */}
                        {endpoint.example && (
                          <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                            <p className="text-xs font-bold text-zinc-600 uppercase">
                              Example
                            </p>

                            {endpoint.example.request && (
                              <div>
                                <p className="text-[10px] text-zinc-600 mb-1">
                                  Request
                                </p>
                                <div className="flex items-start gap-2">
                                  <pre className="flex-1 text-[10px] text-white bg-white/5 p-2 rounded overflow-x-auto">
                                    {endpoint.example.request}
                                  </pre>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        endpoint.example?.request || "",
                                        `req-${endpointId}`
                                      )
                                    }
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex-shrink-0"
                                  >
                                    {copiedId === `req-${endpointId}` ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                      <Copy className="h-4 w-4 text-zinc-500" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}

                            {endpoint.example.response && (
                              <div>
                                <p className="text-[10px] text-zinc-600 mb-1">
                                  Response
                                </p>
                                <div className="flex items-start gap-2">
                                  <pre className="flex-1 text-[10px] text-white bg-white/5 p-2 rounded overflow-x-auto">
                                    {endpoint.example.response}
                                  </pre>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        endpoint.example?.response || "",
                                        `res-${endpointId}`
                                      )
                                    }
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex-shrink-0"
                                  >
                                    {copiedId === `res-${endpointId}` ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                      <Copy className="h-4 w-4 text-zinc-500" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          Authentication
        </p>
        <p className="text-[10px] text-blue-400">
          All authenticated endpoints require an Authorization header with a
          valid admin token. Get your token from Settings → API Keys.
        </p>
      </div>
    </div>
  );
}
