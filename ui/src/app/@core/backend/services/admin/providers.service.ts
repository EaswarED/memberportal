import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProviderConfigApi } from '../../api/admin/providers.api';

@Injectable()
export class ProviderConfigService {
	constructor(private api: ProviderConfigApi) {}

	getProviderConfiglist() {
		return this.api.getProviderConfiglist();
	}

	getProviderConfigDetails(id: number) {
		return this.api.getProviderConfigDetails(id);
	}

	AddProviderConfiglist(data: any) {
		return this.api.AddProviderConfiglist(data);
	}

	RemoveClassProviderConfiglist(data: any) {
		return this.api.RemoveClassProviderConfiglist(data);
	}
	save(data: any) {
		return this.api.save(data);
	}
}
