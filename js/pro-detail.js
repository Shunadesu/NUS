import { initReviews } from './modules/review.js'
import {initTabs} from './modules/tabs.js'

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initReviews();
})