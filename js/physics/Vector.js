export const Vector = {
    // Calculates the straight-line distance between two points
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Calculates the angle (in radians) from point 1 to point 2
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    // Pushes two overlapping circular entities apart so they don't get stuck inside each other
    preventOverlap(entity1, entity2) {
        const dist = this.distance(entity1.x, entity1.y, entity2.x, entity2.y);
        const minDistance = entity1.radius + entity2.radius;

        if (dist < minDistance && dist > 0) { // Check > 0 to prevent divide-by-zero
            const overlap = minDistance - dist;
            const pushAngle = this.angle(entity1.x, entity1.y, entity2.x, entity2.y);
            
            // Split the push distance equally between both objects
            const pushX = Math.cos(pushAngle) * (overlap / 2);
            const pushY = Math.sin(pushAngle) * (overlap / 2);

            entity1.x -= pushX;
            entity1.y -= pushY;
            entity2.x += pushX;
            entity2.y += pushY;
        }
    }
};
