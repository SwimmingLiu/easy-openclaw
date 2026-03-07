# Docker 安装指南

本指南介绍如何使用 Docker 部署 OpenClaw。Docker 方式适合服务器环境、需要环境隔离的场景，
或希望快速试用而不想影响本地系统的用户。

## 系统要求

- **Docker Engine** 20.10+ 或 **Docker Desktop** 4.0+
- **Docker Compose** v2
- **内存**：至少 2GB 可用 RAM
- **磁盘空间**：至少 1GB 可用空间（镜像约 150MB，加配置数据）
- **操作系统**：Linux、macOS 或 Windows（需要 WSL2）

## 安装 Docker

如果尚未安装 Docker，参考以下官方指南：

- [Docker Desktop for macOS](https://docs.docker.com/desktop/install/mac-install/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Engine for Linux](https://docs.docker.com/engine/install/)

验证 Docker 安装：

```bash
docker --version
docker compose version
```

## 快速启动

### 使用 docker-setup.sh 脚本（推荐）

OpenClaw 提供了一键启动脚本：

```bash
# 进入 OpenClaw 目录
cd openclaw

# 运行启动脚本
./docker-setup.sh
```

脚本会自动构建镜像（或拉取远程镜像）并启动服务。

### 使用远程镜像

如果不想在本地构建镜像，可以使用官方发布的远程镜像：

```bash
export OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest
./docker-setup.sh
```

可用的镜像标签：

- `latest`：最新稳定版本
- `v1.x.x`：指定版本号
- `nightly`：每日构建（可能不稳定）

## 手动配置 Docker Compose

如果你需要自定义配置，可以手动创建 `docker-compose.yml`：

```yaml
services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:latest
    restart: unless-stopped

    environment:
      - TZ=Asia/Shanghai
      # AI API 密钥（通过环境变量注入，避免写入配置文件）
      # - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      # - OPENAI_API_KEY=${OPENAI_API_KEY}

    ports:
      - "18789:18789"

    volumes:
      # 配置目录持久化（关键！）
      - ~/.openclaw:/root/.openclaw

    healthcheck:
      test: ["CMD", "openclaw", "health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

启动服务：

```bash
docker compose up -d
```

## 访问 OpenClaw

容器启动后，通过以下方式访问：

```
http://127.0.0.1:18789/
```

首次访问需要输入 gateway token。在容器日志中查找 token：

```bash
docker compose logs openclaw | grep token
```

## 配置持久化

OpenClaw 的配置存储在 `~/.openclaw/` 目录。通过 volume 挂载确保配置在容器重启后不丢失：

```yaml
volumes:
  - ~/.openclaw:/root/.openclaw
```

配置目录结构：

```
~/.openclaw/
├── openclaw.json    # 主配置文件（AI 模型、插件、渠道配置）
├── env              # 环境变量（API 密钥等敏感信息）
├── logs/            # 日志文件
├── data/            # 数据文件
├── skills/          # 自定义技能
└── backups/         # 配置备份
```

## 容器管理

### 查看运行状态

```bash
# 查看容器状态
docker compose ps

# 查看实时日志
docker compose logs -f openclaw

# 查看最近 100 行日志
docker compose logs --tail=100 openclaw
```

### 停止和启动

```bash
# 停止容器
docker compose stop

# 启动容器
docker compose start

# 重启容器
docker compose restart
```

### 更新到新版本

```bash
# 拉取最新镜像
docker compose pull

# 重新创建容器
docker compose up -d
```

### 进入容器调试

```bash
docker compose exec openclaw bash
```

在容器内部，可以运行所有 `openclaw` 命令：

```bash
openclaw doctor
openclaw status
openclaw health
```

## 中国大陆网络优化

### 配置 Docker 镜像加速

在 Docker Desktop 的设置中，或 Linux 的 `/etc/docker/daemon.json` 中配置镜像加速地址：

```json
{
  "registry-mirrors": [
    "https://mirror.gcr.io",
    "https://hub-mirror.c.163.com"
  ]
}
```

修改后重启 Docker：

```bash
sudo systemctl restart docker
```

### 使用国内镜像仓库

```bash
# 使用阿里云容器镜像服务（需要登录）
export OPENCLAW_IMAGE=registry.cn-hangzhou.aliyuncs.com/openclaw/openclaw:latest
./docker-setup.sh
```

### 容器内配置 API 代理

在 `docker-compose.yml` 的 `environment` 部分添加：

```yaml
environment:
  - TZ=Asia/Shanghai
  - ANTHROPIC_BASE_URL=https://your-api-proxy.com
  - OPENAI_BASE_URL=https://your-api-proxy.com/v1
```

或者通过 `.env` 文件管理敏感信息：

```bash
# .env 文件（不要提交到 Git！）
ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_BASE_URL=https://your-api-proxy.com
OPENAI_API_KEY=sk-xxxxx
```

在 `docker-compose.yml` 中引用：

```yaml
environment:
  - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
  - ANTHROPIC_BASE_URL=${ANTHROPIC_BASE_URL}
```

## 健康检查

容器内置健康检查，每 30 秒运行一次：

```bash
# 查看健康状态
docker compose ps
# 状态显示 "healthy" 表示正常，"unhealthy" 表示异常

# 手动运行健康检查
docker compose exec openclaw openclaw health
```

如果健康检查失败，查看日志排查原因：

```bash
docker compose logs --tail=50 openclaw
```

## 与本地 Ollama 集成（可选）

如果你想在 Docker 中使用本地 Ollama 模型，在 `docker-compose.yml` 中添加 Ollama 服务：

```yaml
services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:latest
    restart: unless-stopped
    ports:
      - "18789:18789"
    volumes:
      - ~/.openclaw:/root/.openclaw
    environment:
      - TZ=Asia/Shanghai
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    # GPU 支持（可选，需要 nvidia-container-toolkit）
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

volumes:
  ollama-data:
```

启动后，在 OpenClaw 配置中将 Ollama 地址设为 `http://ollama:11434`。

## 常见问题

### 容器无法启动

查看启动日志：

```bash
docker compose logs openclaw
```

常见原因：

- 端口 18789 已被占用：修改 `ports` 映射，如 `"18790:18789"`
- 配置目录权限问题：运行 `chmod 755 ~/.openclaw`

### 无法访问 Gateway

检查容器是否正在运行：

```bash
docker compose ps
```

检查端口映射是否正确：

```bash
docker compose port openclaw 18789
```

### 配置不生效

修改配置文件后，重启容器使配置生效：

```bash
docker compose restart openclaw
```

### 镜像拉取超时

在中国大陆，拉取 GitHub Container Registry（`ghcr.io`）可能超时。可以：

1. 配置 Docker 镜像加速（见上文）
2. 先在能访问的环境拉取镜像，再 `docker save` 导出并传输

## 下一步

- 容器启动后，访问 `http://127.0.0.1:18789/` 打开控制面板
- 查阅[常见问题排查手册](./troubleshooting.md)解决安装问题
- 访问 [OpenClaw 官方文档](https://docs.openclaw.ai)了解更多功能
