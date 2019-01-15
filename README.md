# whistle.autopac
自动加载系统(Mac或Windows)配置的pac脚本设置到whistle，主要用于某些公司会通过在系统代理里面配置pac脚本访问外网。

# 安装

1. 安装Node(如已安装跳过此步骤)： [https://nodejs.org/en/](https://nodejs.org/en/)

2. 安装最新版的[whistle](https://github.com/avwo/whistle)(建议用最新版本，如已安装跳过此步骤)：

		npm i -g whistle
	
		# Mac、Linux用户可能需要加sudo
		sudo npm i -g whistle

	**whistle安装后执行命令 `w2 restart` 重启** 


4. 安装 `autopac` 插件：

		npm i -g whistle.autopac
	
		# Mac、Linux用户可能需要加sudo
		sudo npm i -g whistle.autopac

> 如果npm比较慢可以使用淘宝镜像安装：https://github.com/cnpm/cnpm

安装后无需任何操作即可自动生效。

