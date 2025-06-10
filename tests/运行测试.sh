#!/bin/bash

# TimeKeeper 测试执行脚本
# 使用方法: ./run-tests.sh [测试类型]

echo "🧪 TimeKeeper 测试套件"
echo "===================="

# 检查参数
TEST_TYPE=${1:-"all"}

# 获取当前目录
CURRENT_DIR=$(pwd)

# 检查必要文件
check_files() {
    echo "🔍 检查必要文件..."
    
    local files=("../计时器.html" "../src/Timer.js" "../会议议程配置.js")
    local missing_files=()
    
    for file in "${files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        echo "❌ 缺少必要文件: ${missing_files[*]}"
        exit 1
    else
        echo "✅ 所有必要文件都存在"
    fi
}

# 兼容性测试
run_compatibility_test() {
    echo ""
    echo "🔧 运行兼容性测试..."
    
    if command -v open &> /dev/null; then
        # macOS
        open "兼容性测试.html"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "兼容性测试.html"
    elif command -v start &> /dev/null; then
        # Windows
        start "兼容性测试.html"
    else
        echo "请手动在浏览器中打开: 兼容性测试.html"
    fi
    
    echo "✅ 兼容性测试页面已打开"
}



# 自动化测试
run_automated_test() {
    echo ""
    echo "🤖 运行自动化测试..."
    
    if command -v open &> /dev/null; then
        # macOS
        open "自动化测试.html"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "自动化测试.html"
    elif command -v start &> /dev/null; then
        # Windows
        start "自动化测试.html"
    else
        echo "请手动在浏览器中打开: 自动化测试.html"
    fi
    
    echo "✅ 自动化测试页面已打开"
    echo "🤖 所有测试会自动运行"
}



# 生成测试报告
generate_test_report() {
    echo ""
    echo "📊 生成测试报告..."
    
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local report_file="test_report_${timestamp}.txt"
    
    {
        echo "TimeKeeper 测试报告"
        echo "=================="
        echo "测试时间: $(date)"
        echo "测试环境: $(uname -s) $(uname -r)"
        echo ""
        echo "文件检查:"
        ls -la *.html *.js 2>/dev/null || echo "  部分文件缺失"
        echo ""
        echo "项目结构:"
        find . -maxdepth 2 -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.md" \) | sort
        echo ""
        echo "自动化测试项目:"
        echo "- 浏览器API兼容性"
        echo "- 基础功能支持检测"
        echo "- 性能指标测试"
    } > "$report_file"
    
    echo "✅ 测试报告已生成: $report_file"
}

# 主程序
main() {
    check_files
    
    case $TEST_TYPE in
        "compatibility"|"compat")
            run_compatibility_test
            ;;
        "automated"|"auto")
            run_automated_test
            ;;
        "report")
            generate_test_report
            ;;
        "all")
            echo ""
            echo "🚀 运行完整自动化测试套件..."
            run_compatibility_test
            sleep 2
            run_automated_test
            sleep 1
            generate_test_report
            ;;
        *)
            echo "❌ 未知的测试类型: $TEST_TYPE"
            echo ""
            echo "可用的测试类型:"
            echo "  all          - 运行所有自动化测试"
            echo "  compatibility - 浏览器兼容性测试"
            echo "  automated    - API自动化测试（推荐）"
            echo "  report       - 生成测试报告"
            echo ""
            echo "使用方法: ./run-tests.sh [测试类型]"
            exit 1
            ;;
    esac
    
    echo ""
    echo "✨ 测试执行完成!"
}

# 执行主程序
main 