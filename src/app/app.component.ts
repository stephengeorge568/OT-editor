import { Component } from '@angular/core';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import { NgxEditorModel } from 'ngx-monaco-editor';
import {MatButtonModule} from '@angular/material/button'; 
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
		this.matIconRegistry.addSvgIcon(
		  `github`,
		  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/github.svg")
		);
	}

	goToPersonalGithub(): void {
		window.open("https://github.com/stephengeorge568");	
	}

}
