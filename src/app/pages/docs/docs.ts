import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Highlight } from 'ngx-highlightjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-docs',
  imports: [RouterLink, NgIf, Highlight],
  templateUrl: './docs.html',
  styleUrl: './docs.css',
})
export class Docs {
  activeExampleTab = signal<'curl' | 'nodejs' | 'go' | 'php' | 'python'>('python');

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  readonly authConnectionCurl = `curl -s -X POST "http://localhost:8000/mcp/jurimcp" \\
  -H "X-Api-Key: sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call",
    "params": {
      "name": "calcular_juros_mora",
      "arguments": {
        "valor_principal": 5000.00,
        "data_vencimento": "2024-01-01",
        "data_calculo": "2024-06-01"
      }
    }
  }'`;

  readonly authUsageCurl = `# Chamar uma tool via HTTP POST
curl -s -X POST "http://localhost:8000/mcp/jurimcp" \\
  -H "X-Api-Key: sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "calcular_juros_mora",
      "arguments": {
        "valor_principal": 5000.00,
        "data_vencimento": "2024-01-01",
        "data_calculo": "2024-06-01"
      }
    }
  }'`;

  readonly exampleCurl = `API_KEY="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
MCP_URL="http://localhost:8000/mcp/jurimcp"

# Listar tools disponíveis
curl -s -X POST "$MCP_URL" \\
  -H "X-Api-Key: $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'

# Chamar calcular_juros_mora
curl -s -X POST "$MCP_URL" \\
  -H "X-Api-Key: $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "calcular_juros_mora",
      "arguments": {
        "valor_principal": 5000.00,
        "data_vencimento": "2024-01-01",
        "data_calculo": "2024-06-01"
      }
    }
  }'`;

  readonly exampleNodejs = `const API_KEY = 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const MCP_URL = 'http://localhost:8000/mcp/jurimcp';

async function mcpCall(id, method, params = {}) {
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'X-Api-Key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
  return res.json();
}

// Listar tools
const tools = await mcpCall(1, 'tools/list');
console.log(tools.result.tools.map(t => t.name));

// Chamar calcular_juros_mora
const result = await mcpCall(2, 'tools/call', {
  name: 'calcular_juros_mora',
  arguments: {
    valor_principal: 5000.00,
    data_vencimento: '2024-01-01',
    data_calculo: '2024-06-01',
  },
});
console.log(result);`;

  readonly exampleGo = `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

const (
    apiKey = "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    mcpURL = "http://localhost:8000/mcp/jurimcp"
)

func mcpCall(id int, method string, params any) (map[string]any, error) {
    body, _ := json.Marshal(map[string]any{
        "jsonrpc": "2.0", "id": id, "method": method, "params": params,
    })
    req, _ := http.NewRequest("POST", mcpURL, bytes.NewReader(body))
    req.Header.Set("X-Api-Key", apiKey)
    req.Header.Set("Content-Type", "application/json")
    resp, err := http.DefaultClient.Do(req)
    if err != nil { return nil, err }
    defer resp.Body.Close()
    data, _ := io.ReadAll(resp.Body)
    var result map[string]any
    json.Unmarshal(data, &result)
    return result, nil
}

func main() {
    result, err := mcpCall(1, "tools/call", map[string]any{
        "name": "calcular_juros_mora",
        "arguments": map[string]any{
            "valor_principal": 5000.00,
            "data_vencimento": "2024-01-01",
            "data_calculo":    "2024-06-01",
        },
    })
    if err != nil { panic(err) }
    fmt.Println(result)
}`;

  readonly examplePhp = `<?php

const API_KEY = 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const MCP_URL = 'http://localhost:8000/mcp/jurimcp';

function mcpCall(int $id, string $method, array $params = []): array {
    $ch = curl_init(MCP_URL);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['jsonrpc' => '2.0', 'id' => $id, 'method' => $method, 'params' => $params]),
        CURLOPT_HTTPHEADER     => ['X-Api-Key: ' . API_KEY, 'Content-Type: application/json'],
    ]);
    $res = curl_exec($ch); curl_close($ch);
    return json_decode($res, true) ?? [];
}

$result = mcpCall(1, 'tools/call', [
    'name'      => 'calcular_juros_mora',
    'arguments' => [
        'valor_principal' => 5000.00,
        'data_vencimento' => '2024-01-01',
        'data_calculo'    => '2024-06-01',
    ],
]);
echo json_encode($result['result']);`;

  readonly examplePython = `# pip install langchain-mcp-adapters
from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient({
    "jurimcp": {
        "url": "http://localhost:8000/mcp/jurimcp",
        "transport": "streamable_http",
        "headers": {
            "X-Api-Key": "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },
    }
})

tools = await client.get_tools()
print([t.name for t in tools])
# ['calcular_juros_mora', 'calcular_correcao_monetaria', 'calcular_honorarios_advocaticios', ...]`;
}
