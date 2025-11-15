#!/bin/bash

echo "📧 Verifying Booking Confirmation Email Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check 1: Email utility file
echo "1️⃣  Checking email utility..."
if [ -f "server/utils/email.js" ]; then
    echo -e "   ${GREEN}✅ Email utility exists: server/utils/email.js${NC}"
    
    # Check if CONCIERGE_EMAIL is set correctly
    if grep -q "tadiwachoga2003@gmail.com" server/utils/email.js; then
        echo -e "   ${GREEN}✅ Concierge email set to: tadiwachoga2003@gmail.com${NC}"
    else
        echo -e "   ${RED}❌ Concierge email not found${NC}"
    fi
    
    # Check if sendBookingConfirmation function exists
    if grep -q "sendBookingConfirmation" server/utils/email.js; then
        echo -e "   ${GREEN}✅ sendBookingConfirmation function exists${NC}"
    else
        echo -e "   ${RED}❌ sendBookingConfirmation function not found${NC}"
    fi
else
    echo -e "   ${RED}❌ Email utility not found${NC}"
    exit 1
fi

# Check 2: Booking controller
echo ""
echo "2️⃣  Checking booking controller..."
if [ -f "server/controllers/bookingController.js" ]; then
    echo -e "   ${GREEN}✅ Booking controller exists${NC}"
    
    # Check if sendBookingConfirmation is imported
    if grep -q "sendBookingConfirmation" server/controllers/bookingController.js; then
        echo -e "   ${GREEN}✅ sendBookingConfirmation imported${NC}"
    else
        echo -e "   ${RED}❌ sendBookingConfirmation not imported${NC}"
    fi
    
    # Check if confirmation email is sent when status is "confirmed"
    if grep -q 'status === "confirmed"' server/controllers/bookingController.js; then
        echo -e "   ${GREEN}✅ Confirmation email trigger found${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Confirmation email trigger not found${NC}"
    fi
else
    echo -e "   ${RED}❌ Booking controller not found${NC}"
    exit 1
fi

# Check 3: Email configuration
echo ""
echo "3️⃣  Checking email configuration..."
if [ -f "server/.env" ]; then
    echo -e "   ${GREEN}✅ server/.env file exists${NC}"
    
    # Check EMAIL_HOST
    if grep -q "EMAIL_HOST" server/.env && ! grep -q "EMAIL_HOST=$" server/.env; then
        EMAIL_HOST=$(grep "EMAIL_HOST" server/.env | cut -d'=' -f2)
        if [ "$EMAIL_HOST" != "your-email@gmail.com" ] && [ "$EMAIL_HOST" != "" ]; then
            echo -e "   ${GREEN}✅ EMAIL_HOST configured: $EMAIL_HOST${NC}"
            EMAIL_CONFIGURED=true
        else
            echo -e "   ${YELLOW}⚠️  EMAIL_HOST has placeholder value${NC}"
            EMAIL_CONFIGURED=false
        fi
    else
        echo -e "   ${YELLOW}⚠️  EMAIL_HOST not configured${NC}"
        EMAIL_CONFIGURED=false
    fi
    
    # Check EMAIL_USER
    if grep -q "EMAIL_USER" server/.env && ! grep -q "EMAIL_USER=$" server/.env; then
        EMAIL_USER=$(grep "EMAIL_USER" server/.env | cut -d'=' -f2)
        if [ "$EMAIL_USER" != "your-email@gmail.com" ] && [ "$EMAIL_USER" != "" ]; then
            echo -e "   ${GREEN}✅ EMAIL_USER configured${NC}"
        else
            echo -e "   ${YELLOW}⚠️  EMAIL_USER has placeholder value${NC}"
            EMAIL_CONFIGURED=false
        fi
    else
        echo -e "   ${YELLOW}⚠️  EMAIL_USER not configured${NC}"
        EMAIL_CONFIGURED=false
    fi
    
    # Check EMAIL_PASS
    if grep -q "EMAIL_PASS" server/.env && ! grep -q "EMAIL_PASS=$" server/.env; then
        EMAIL_PASS=$(grep "EMAIL_PASS" server/.env | cut -d'=' -f2)
        if [ "$EMAIL_PASS" != "your-app-password" ] && [ "$EMAIL_PASS" != "" ]; then
            echo -e "   ${GREEN}✅ EMAIL_PASS configured${NC}"
        else
            echo -e "   ${YELLOW}⚠️  EMAIL_PASS has placeholder value${NC}"
            EMAIL_CONFIGURED=false
        fi
    else
        echo -e "   ${YELLOW}⚠️  EMAIL_PASS not configured${NC}"
        EMAIL_CONFIGURED=false
    fi
else
    echo -e "   ${RED}❌ server/.env file not found${NC}"
    EMAIL_CONFIGURED=false
fi

# Check 4: Server running
echo ""
echo "4️⃣  Checking server status..."
if ps aux | grep -E "node.*server/index" | grep -v grep > /dev/null; then
    echo -e "   ${GREEN}✅ Backend server is running${NC}"
    SERVER_RUNNING=true
else
    echo -e "   ${YELLOW}⚠️  Backend server is not running${NC}"
    echo -e "   ${BLUE}💡 Start with: npm run dev:server${NC}"
    SERVER_RUNNING=false
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$EMAIL_CONFIGURED" = true ] && [ "$SERVER_RUNNING" = true ]; then
    echo -e "${GREEN}✅ Email setup verified!${NC}"
    echo ""
    echo -e "${BLUE}📋 When a booking is confirmed:${NC}"
    echo "   • Email will be sent to: tadiwachoga2003@gmail.com"
    echo "   • Email will include all booking details"
    echo "   • Both concierge and guest will receive emails"
else
    echo -e "${YELLOW}⚠️  Configuration needed${NC}"
    echo ""
    if [ "$EMAIL_CONFIGURED" = false ]; then
        echo -e "${YELLOW}• Configure email in server/.env:${NC}"
        echo "  - EMAIL_HOST=smtp.gmail.com"
        echo "  - EMAIL_PORT=587"
        echo "  - EMAIL_USER=your-actual-email@gmail.com"
        echo "  - EMAIL_PASS=your-actual-app-password"
        echo "  - EMAIL_SECURE=false"
        echo "  - EMAIL_FROM=your-actual-email@gmail.com"
    fi
    if [ "$SERVER_RUNNING" = false ]; then
        echo -e "${YELLOW}• Start backend server:${NC}"
        echo "  npm run dev:server"
    fi
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 See BOOKING_CONFIRMATION_FLOW.md for details"
echo ""

